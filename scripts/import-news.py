#!/usr/bin/env python3
"""Пренася нови новини от стария Google сайт (качени там след първото пренасяне).

Текстовете са в seed/news/<дата>.json (заглавие, дата, текст и „маркер“ — част от заглавието).
Снимките се вземат наживо от страницата с новините: всички снимки между маркера на една новина
и маркера на следващата (за последната — end_marker). Свалят се, качват се в R2 и се пише out/news.sql
(INSERT OR IGNORE — пускане втори път не прави двойни новини).

  python3 -I scripts/import-news.py seed/news/2026-10-29.json dry   # само проверка
  python3 -I scripts/import-news.py seed/news/2026-10-29.json run
"""
import hashlib, json, os, re, subprocess, sys, urllib.parse, urllib.request

SRC, MODE = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else 'dry')
D = json.load(open(SRC, encoding='utf-8'))
BUCKET = 'souvalchidol-files'
IMG = re.compile(r'https://sites\.google\.com/sitesv-images-rt/[A-Za-z0-9_\-]+')
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read(), r.headers.get('Content-Type', '')


def note(msg):  # вижда се в GitHub (Actions → пускането → Annotations)
    print(f'::notice::{msg}', flush=True)


p = urllib.parse.urlsplit(D['page'])
html = get(urllib.parse.urlunsplit((p.scheme, p.netloc, urllib.parse.quote(p.path), p.query, '')))[0].decode('utf-8', 'replace')
html = html[html.find('</head>'):].replace('\\u003d', '=').replace('\\/', '/').replace('&amp;', '&')

# позиции на маркерите, по ред
marks, pos = [], 0
for m in [n['marker'] for n in D['news']] + [D['end_marker']]:
    i = html.find(m, pos)
    if i < 0:
        sys.exit(f'::error::Не намерих „{m}“ на страницата')
    marks.append(i); pos = i + 1

groups = []
for k, n in enumerate(D['news']):
    seg = html[marks[k]:marks[k + 1]]
    seen, urls = set(), []
    for u in IMG.findall(seg):
        if u not in seen:
            seen.add(u); urls.append(u)
    groups.append(urls)
    exp = D.get('expect_photos', [None] * len(D['news']))[k]
    note(f'{n["title"][:50]}: {len(urls)} снимки' + (f' (очаквани {exp})' if exp is not None else ''))
    if not urls:
        sys.exit(f'::error::Няма снимки за „{n["title"]}“')

if MODE != 'run':
    sys.exit(0)

os.makedirs('out', exist_ok=True)


def store(u):
    key = 'stari/' + hashlib.sha1(u.encode()).hexdigest()[:16]
    data, ctype = get(u + '=w1600')
    ctype = (ctype or 'image/jpeg').split(';')[0]
    if not ctype.startswith('image/'):
        raise RuntimeError(f'не е снимка: {ctype}')
    key += {'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp'}.get(ctype, '.jpg')
    path = os.path.join('out', key.replace('/', '_'))
    open(path, 'wb').write(data)
    r = subprocess.run(['npx', 'wrangler', 'r2', 'object', 'put', f'{BUCKET}/{key}', '--file', path, '--content-type', ctype, '--remote'],
                       capture_output=True, text=True)
    os.remove(path)
    if r.returncode:
        raise RuntimeError('R2: ' + r.stderr[-300:])
    return f'/files/{key}'


q = lambda s: 'NULL' if s is None else "'" + str(s).replace("'", "''") + "'"
sql = []
for n, urls in zip(D['news'], groups):
    files = []
    for u in urls:
        try:
            files.append(store(u))
        except Exception as e:  # noqa: BLE001
            print(f'::warning::{n["title"][:40]}: снимка не се свали ({e})')
    cover = files[0] if files else None
    sql.append(
        'INSERT OR IGNORE INTO site_news (id, title, excerpt, content, cover_url, gallery_images, category, status, published_at, author_name) VALUES '
        f"({q(n['id'])}, {q(n['title'])}, {q(n['excerpt'])}, {q(n['content'])}, {q(cover)}, {q(json.dumps(files[1:], ensure_ascii=False))}, "
        f"'Новини', 'published', {q(n['published_at'])}, 'стария сайт');")
    note(f'{n["title"][:50]}: качени {len(files)} от {len(urls)} снимки')
open('out/news.sql', 'w', encoding='utf-8').write('\n'.join(sql) + '\n')
