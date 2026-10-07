"""Radar Oscar: RSS/Atom sin dependencias, credenciales ni generación de IA."""
import argparse
import hashlib
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

SOURCES = (
    {'id':'openai','name':'OpenAI','url':'https://openai.com/news/rss.xml','kind':'original'},
    {'id':'huggingface','name':'Hugging Face','url':'https://huggingface.co/blog/feed.xml','kind':'community'},
    {'id':'techcrunch','name':'TechCrunch IA','url':'https://techcrunch.com/category/artificial-intelligence/feed/','kind':'press'},
    {'id':'openai-community','name':'Comunidad OpenAI','url':'https://community.openai.com/c/announcements/6.rss','kind':'community'},
)
LIMIT = 4_000_000
TOPICS = {
    'agentes':r'agent|agént|computer.use|automation|automat|decision|workflow|orchestrat',
    'modelos':r'\bmodel|\bgpt|\bllm|claude|gemini|\bbeam\b|nemotron|grok|weights|pesos',
    'crear':r'video|image|imagen|design|diseñ|creative|creativ|audio|voice|voz|visual|interface|interfaz',
    'trabajo':r'business|enterprise|work|trabaj|research|investig|office|hotel|commerce|coding|code|developer|api|tool|herramient',
}

def clean(value, length=600):
    value = html.unescape(html.unescape(value or ''))
    value = re.sub(r'<[^>]*>', ' ', value)
    value = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', value)
    return re.sub(r'\s+', ' ', value).strip()[:length]

def canonical_url(value):
    try:
        u = urlsplit((value or '').strip())
        if u.scheme not in ('https','http') or not u.hostname or u.username or u.password:
            return None
        query = [(k,v)for k,v in parse_qsl(u.query,keep_blank_values=True)
                 if not k.lower().startswith('utm_') and k.lower()not in ('fbclid','gclid','s','ref')]
        return urlunsplit((u.scheme,u.netloc.lower(),u.path or '/',urlencode(query),'')).rstrip('/')
    except ValueError:
        return None

def parse_date(value):
    if not value:return None
    try:
        date = datetime.fromisoformat(value.strip().replace('Z','+00:00'))
    except ValueError:
        try:date = parsedate_to_datetime(value)
        except (ValueError,TypeError,OverflowError):return None
    if date.tzinfo is None:return None
    return date.astimezone(timezone.utc)

def iso(date):
    return date.astimezone(timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z')

def child(entry,name):
    return next((e for e in entry if e.tag.split('}')[-1]==name),None)

def value(entry,name):
    e=child(entry,name)
    return ''.join(e.itertext()).strip() if e is not None else ''

def parse_feed(data, source):
    if len(data)>LIMIT or re.search(br'<!\s*(DOCTYPE|ENTITY)\b',data,re.I):
        raise ValueError('Feed XML no admitido')
    root=ET.fromstring(data)
    articles=[]
    for entry in root.iter():
        local=entry.tag.split('}')[-1]
        if local not in ('item','entry'):continue
        title=clean(value(entry,'title'),260)
        if local=='entry':
            links=[e for e in entry if e.tag.split('}')[-1]=='link' and e.attrib.get('rel','alternate')=='alternate']
            link=links[0].attrib.get('href','') if links else ''
            # An update must not make an old entry look newly published.
            date=parse_date(value(entry,'published'))
            summary=clean(value(entry,'summary')or value(entry,'content'))
        else:
            link=value(entry,'link')
            if not link:
                guid=child(entry,'guid')
                if guid is not None and guid.attrib.get('isPermaLink','true')=='true':link=guid.text or ''
            date=parse_date(value(entry,'pubDate')or value(entry,'date'))
            summary=clean(value(entry,'description')or value(entry,'encoded'))
        url=canonical_url(link)
        if not title or not url or date is None:continue
        searchable=(title+' '+summary).lower()
        articles.append({
            'id':hashlib.sha256(url.encode()).hexdigest()[:16],
            'title':title,'url':url,'summary':summary,'published_at':iso(date),
            'source':source['name'],'source_id':source['id'],'source_kind':source['kind'],
            'tags':[name for name,pattern in TOPICS.items() if re.search(pattern,searchable,re.I)],
            'coverage':[{'name':source['name'],'url':url}],
        })
    return articles

def fetch_feed(source):
    request=urllib.request.Request(source['url'],headers={
        'User-Agent':'OscarRadar/1.0 (+https://www.oscarzambrano.cl/radar/)',
        'Accept':'application/rss+xml, application/atom+xml, application/xml, text/xml',
    })
    with urllib.request.urlopen(request,timeout=9)as response:
        data=response.read(LIMIT+1)
    if len(data)>LIMIT:raise ValueError('Feed demasiado grande')
    return data

def build_payload(now=None, fetcher=None):
    now=now or datetime.now(timezone.utc)
    if now.tzinfo is None:raise ValueError('La hora debe incluir zona horaria')
    fetcher=fetcher or fetch_feed
    def collect(source):
        state={**source,'status':'ok','checked_at':iso(now)}
        try:
            items=parse_feed(fetcher(source),source)
            state['parsed_count']=len(items)
            return state,items
        except Exception:
            state.update(status='error',parsed_count=0)
            return state,[]
    with ThreadPoolExecutor(max_workers=4)as pool:results=list(pool.map(collect,SOURCES))
    unique={}
    for state,items in results:
        for article in items:
            age=(now-parse_date(article['published_at'])).total_seconds()
            if age<0:continue
            key=article['url']
            if key in unique:
                coverage=unique[key]['coverage']
                if article['coverage'][0]not in coverage:coverage.extend(article['coverage'])
                # Earliest known publication wins; repeated coverage must not rejuvenate it.
                if article['published_at']<unique[key]['published_at']:
                    unique[key]['published_at']=article['published_at']
            else:unique[key]=article
    fresh=[a for a in unique.values() if (now-parse_date(a['published_at'])).total_seconds()<=48*3600]
    articles=sorted(fresh,key=lambda a:a['published_at'],reverse=True)[:120]
    return {'version':1,'generated_at':iso(now),'window_hours':48,
            'articles':articles,'sources':[state for state,_ in results],
            'date_basis':'Fecha de publicación en la fuente. No certifica la fecha del anuncio original.'}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description='Radar Oscar: últimas 48 horas de IA')
    parser.add_argument('--output',help='Guardar JSON en este archivo; si se omite, imprimirlo')
    args=parser.parse_args()
    payload=build_payload()
    text=json.dumps(payload,ensure_ascii=False,indent=2)
    if args.output:
        with open(args.output,'w',encoding='utf-8')as out:out.write(text+'\n')
    else:print(text)
    if not any(s['status']=='ok'for s in payload['sources']):raise SystemExit(1)
