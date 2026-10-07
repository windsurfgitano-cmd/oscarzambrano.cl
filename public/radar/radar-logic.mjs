export function normalise(value=''){
 return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}
export function filterArticles(articles,{hours=24,topic='todos',query='',source='todos',now=Date.now()}={}){
 const q=normalise(query).trim();
 return articles.filter(article=>{
  const date=Date.parse(article.published_at),age=now-date;
  if(!Number.isFinite(date)||age<0||age>hours*3600000)return false;
  if(topic!=='todos'&&!article.tags?.includes(topic))return false;
  if(source!=='todos'&&article.source_id!==source)return false;
  return !q||normalise([article.title,article.summary,article.source].join(' ')).includes(q);
 }).sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at));
}
