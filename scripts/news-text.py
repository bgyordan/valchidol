#!/usr/bin/env python3
"""Показва в лога текста на страницата с новините от стария сайт до даден маркер,
за да се препише точно в seed/news/<дата>.json.

  python3 -I scripts/news-text.py 'СВЕТЪТ НА АНИМАЦИЯТА'
"""
import html as H, re, sys, urllib.parse, urllib.request

PAGE = 'https://sites.google.com/view/suvasillevski/секция-актуално'
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
stop = sys.argv[1] if len(sys.argv) > 1 else None

p = urllib.parse.urlsplit(PAGE)
url = urllib.parse.urlunsplit((p.scheme, p.netloc, urllib.parse.quote(p.path), '', ''))
with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
    s = r.read().decode('utf-8', 'replace')
s = s[s.find('</head>'):]
s = re.sub(r'(?is)<(script|style)\b.*?</\1>', '', s)
s = re.sub(r'(?i)<img\b[^>]*>', '\n[СНИМКА]\n', s)
s = re.sub(r'(?i)<br\s*/?>', '\n', s)
s = re.sub(r'(?i)</(p|div|h\d|li|section)>', '\n', s)
s = H.unescape(re.sub(r'<[^>]+>', '', s))
lines, prev = [], None
for ln in (l.strip() for l in s.split('\n')):
    if ln and ln != prev:
        lines.append(ln)
    prev = ln
out = '\n'.join(lines)
if stop and stop in out:
    out = out[:out.find(stop) + 2000]
print('=====ТЕКСТ=====')
print(out)
print('=====КРАЙ=====')
