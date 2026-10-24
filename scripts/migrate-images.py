#!/usr/bin/env python3
"""Сваля снимките от стария Google сайт в R2 и сменя адресите в базата.

Старите адреси (sites.google.com/sitesv-images-rt/...) в базата вече не работят: Google ги
подписва за кратко. Затова отваряме всяка стара страница наново, взимаме пресните адреси на
снимките в същия ред и ги сдвояваме със старите от описа (scripts/old-images.json).

  python3 -I scripts/migrate-images.py dry   # само проверка: брой снимки по страници
  python3 -I scripts/migrate-images.py run   # сваля, качва в R2, пише out/images.sql
"""
import hashlib, json, os, re, subprocess, sys, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

MODE = sys.argv[1] if len(sys.argv) > 1 else 'dry'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD = json.load(open(os.path.join(ROOT, 'scripts/old-images.json'), encoding='utf-8'))
BUCKET = 'souvalchidol-files'
IMG = re.compile(r'https://(?:sites\.google\.com/sitesv-images-rt|lh\d\.googleusercontent\.com)/[A-Za-z0-9_\-=./%]+')
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}


def sized(u: str) -> str:  # както в import-old-site.py
    return re.sub(r'=w16383$', '=w1600', u)


def base(u: str) -> str:  # без размера накрая (=w16383, =w1200-h630-p ...)
    return re.sub(r'=[whsp][0-9A-Za-z\-]*$', '', u)


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(), r.headers.get('Content-Type', '')


def live_images(page: str) -> list[str]:
    p = urllib.parse.urlsplit(page)
    url = urllib.parse.urlunsplit((p.scheme, p.netloc, urllib.parse.quote(p.path), p.query, ''))
    html = get(url)[0].decode('utf-8', 'replace')
    body = html[html.find('</head>'):]
    body = body.replace('\\u003d', '=').replace('\\/', '/').replace('&amp;', '&')
    out, seen = [], set()
    for u in IMG.findall(body):
        if 'gstatic.com' in u:
            continue
        b = base(u)
        if b in seen:
            continue
        seen.add(b)
        out.append(u)
    return out


def main():
    pairs, report = [], []
    lives = {}
    for page, old in OLD.items():
        if page == 'COMMON' or not old:
            continue
        try:
            lives[page] = live_images(page)
        except Exception as e:  # noqa: BLE001
            report.append((page, len(old), f'ГРЕШКА {e}'))
    # снимките на целия сайт (лого, шапка…) са на всяка страница → не са в описа на страницата
    from collections import Counter
    cnt = Counter(base(u) for l in lives.values() for u in l)
    common = {b for b, n in cnt.items() if n >= len(lives) * 0.8}
    print('Общи за всички страници:', len(common))
    for page, fresh in lives.items():
        old = OLD[page]
        pos = [i for i, u in enumerate(fresh) if base(u) in common]
        fresh = [u for u in fresh if base(u) not in common]
        if len(fresh) == len(old) + 3 and not common:
            fresh = fresh[3:]
        status = 'OK' if len(fresh) == len(old) else f'live={len(fresh)}'
        report.append((page, len(old), status + f' общи@{pos}'))
        if len(fresh) == len(old):
            pairs += [(o, f) for o, f in zip(old, fresh)]
    ok = sum(1 for r in report if r[2].startswith('OK'))
    for r in report:
        print(f'{r[2]:>12}  opis={r[1]:<4} {urllib.parse.unquote(r[0])[38:]}')
    print(f'\nСтраници: {ok}/{len(report)} съвпадат; снимки за сваляне: {len(pairs)}')
    if MODE != 'run':
        return

    os.makedirs('out', exist_ok=True)

    def one(pair):
        old, fresh = pair
        key = 'stari/' + hashlib.sha1(base(old).encode()).hexdigest()[:16]
        try:
            data, ctype = get(base(fresh) + '=w1600')
        except Exception as e:  # noqa: BLE001
            return old, None, str(e)
        ext = {'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp'}.get(ctype.split(';')[0], '.jpg')
        path = os.path.join('out', key.replace('/', '_') + ext)
        open(path, 'wb').write(data)
        r = subprocess.run(['npx', 'wrangler', 'r2', 'object', 'put', f'{BUCKET}/{key}{ext}', '--file', path,
                            '--content-type', ctype.split(';')[0] or 'image/jpeg', '--remote'],
                           capture_output=True, text=True)
        os.remove(path)
        if r.returncode:
            return old, None, r.stderr[-300:]
        return old, f'/files/{key}{ext}', None

    done, failed = [], 0
    with ThreadPoolExecutor(8) as ex:
        for i, (old, new, err) in enumerate(ex.map(one, pairs), 1):
            if new:
                done.append((old, new))
            else:
                failed += 1
                print('FAIL', old[:80], err)
            if i % 100 == 0:
                print(f'… {i}/{len(pairs)}', flush=True)
    print(f'Качени: {len(done)}, неуспешни: {failed}')

    q = lambda s: "'" + s.replace("'", "''") + "'"
    cols = {'site_news': ['cover_url', 'gallery_images', 'content'], 'site_pages': ['photos', 'body'], 'site_settings': ['value']}
    with open('out/images.sql', 'w', encoding='utf-8') as f:
        for old, new in done:
            for t, cs in cols.items():
                for c in cs:
                    for variant in {old, sized(old)}:
                        f.write(f'UPDATE {t} SET {c} = REPLACE({c}, {q(variant)}, {q(new)}) WHERE instr({c}, {q(variant)}) > 0;\n')
    print('Записан out/images.sql')


if __name__ == '__main__':
    main()
