import sys
import unittest
from pathlib import Path
from datetime import datetime, timezone

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from radar_core import parse_feed, build_payload

SOURCE = {'id':'one','name':'Fuente uno','url':'https://source.test/feed','kind':'original'}
NOW = datetime(2026,10,7,19,0,tzinfo=timezone.utc)

def rss(items):
    return ('<rss><channel>'+''.join(
        '<item><title>'+title+'</title><link>'+url+'</link><pubDate>'+date+'</pubDate><description>&lt;b&gt;Texto&lt;/b&gt;</description></item>'
        for title,url,date in items)+'</channel></rss>').encode()

class RadarTests(unittest.TestCase):
    def test_rss_cleans_markup_without_rendering_it(self):
        data=rss([('Claude &amp; IA','https://source.test/a?utm_source=x','Wed, 07 Oct 2026 18:00:00 GMT')])
        article=parse_feed(data,SOURCE)[0]
        self.assertEqual(article['title'],'Claude & IA')
        self.assertEqual(article['summary'],'Texto')
        self.assertEqual(article['url'],'https://source.test/a')
        self.assertEqual(article['published_at'],'2026-10-07T18:00:00Z')

    def test_atom_published_date_wins_over_updated(self):
        data=b'''<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Old</title><link href="https://source.test/old"/><published>2026-07-01T10:00:00Z</published><updated>2026-10-07T18:00:00Z</updated></entry></feed>'''
        self.assertEqual(parse_feed(data,SOURCE)[0]['published_at'],'2026-07-01T10:00:00Z')

    def test_unsafe_urls_and_missing_dates_are_not_articles(self):
        data=rss([('Bad','javascript:alert(1)','Wed, 07 Oct 2026 18:00:00 GMT'),('No date','https://source.test/a','')])
        self.assertEqual(parse_feed(data,SOURCE),[])

    def test_xml_entities_are_rejected(self):
        with self.assertRaises(ValueError):
            parse_feed(b'<!DOCTYPE a [<!ENTITY evil "x">]><rss/>',SOURCE)

    def test_time_window_does_not_rejuvenate_old_or_future_items(self):
        data=rss([('Recent','https://source.test/recent','Wed, 07 Oct 2026 18:00:00 GMT'),('Old','https://source.test/old','Sun, 04 Oct 2026 18:00:00 GMT'),('Future','https://source.test/future','Thu, 08 Oct 2026 18:00:00 GMT')])
        payload=build_payload(NOW, lambda source: data)
        self.assertEqual([x['title']for x in payload['articles']],['Recent'])

    def test_repeated_url_across_sources_is_one_article(self):
        data=rss([('News','https://source.test/shared','Wed, 07 Oct 2026 18:00:00 GMT')])
        payload=build_payload(NOW,lambda source:data)
        self.assertEqual(len(payload['articles']),1)
        self.assertGreater(len(payload['articles'][0]['coverage']),1)

    def test_failed_feed_preserves_successful_feeds_and_reports_failure(self):
        def fetch(source):
            if source['id']=='openai':raise OSError('upstream failed')
            return rss([('Good','https://source.test/good','Wed, 07 Oct 2026 18:00:00 GMT')])
        payload=build_payload(NOW,fetch)
        self.assertEqual(len(payload['articles']),1)
        self.assertEqual(next(s for s in payload['sources']if s['id']=='openai')['status'],'error')
        self.assertEqual(sum(s['status']=='ok'for s in payload['sources']),3)

    def test_old_original_cannot_be_rejuvenated_by_another_feed(self):
        def fetch(source):
            date='Wed, 07 Oct 2026 18:00:00 GMT' if source['id']=='techcrunch' else 'Tue, 01 Sep 2026 18:00:00 GMT'
            return rss([('Same page','https://source.test/same',date)])
        self.assertEqual(build_payload(NOW,fetch)['articles'],[])

if __name__=='__main__':unittest.main()
