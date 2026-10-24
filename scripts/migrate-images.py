#!/usr/bin/env python3
"""Сваля снимките от стария Google сайт в R2 и сменя адресите в базата.

Старите адреси (sites.google.com/sitesv-images-rt/...) в базата вече не работят: Google ги
подписва за кратко. Затова отваряме всяка стара страница наново, взимаме пресните адреси на
снимките в същия ред и ги сдвояваме със старите от описа (scripts/old-images.json).

  python3 -I scripts/migrate-images.py dry   # само проверка: брой снимки по страници
  python3 -I scripts/migrate-images.py run   # сваля, качва в R2, пише out/images.sql
"""
import hashlib, json, os, re, subprocess, sys, urllib.parse, urllib.request
from collections import Counter
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


def get(url: str):
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


def upload(old: str, fresh: str):
    key = 'stari/' + hashlib.sha1(base(old).encode()).hexdigest()[:16]
    try:
        data, ctype = get(base(fresh) + '=w1600')
    except Exception as e:  # noqa: BLE001
        return old, None, f'сваляне: {e}'
    ctype = (ctype or 'image/jpeg').split(';')[0]
    if not ctype.startswith('image/'):
        return old, None, f'не е снимка: {ctype}'
    ext = {'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp'}.get(ctype, '.jpg')
    path = os.path.join('out', key.replace('/', '_') + ext)
    with open(path, 'wb') as f:
        f.write(data)
    r = subprocess.run(['npx', 'wrangler', 'r2', 'object', 'put', f'{BUCKET}/{key}{ext}', '--file', path,
                        '--content-type', ctype, '--remote'], capture_output=True, text=True)
    os.remove(path)
    if r.returncode:
        return old, None, 'R2: ' + r.stderr[-300:]
    return old, f'/files/{key}{ext}', None


def main():
    pages = [p for p, old in OLD.items() if p != 'COMMON' and old]
    lives = {}
    for page in pages:
        try:
            lives[page] = live_images(page)
        except Exception as e:  # noqa: BLE001
            print('ГРЕШКА', page, e)
    # снимките на целия сайт (лого, шапка…) са на всяка страница → не са в описа на страницата
    cnt = Counter(base(u) for l in lives.values() for u in l)
    common = {b for b, n in cnt.items() if n >= len(lives) * 0.8}
    print('Общи за всички страници:', len(common))

    # общите са винаги на едни и същи места: първата и последните две снимки на страницата.
    # Адресите им се сменят при всяко отваряне, затова при второто отваряне махаме по място.
    def pairs_for(page, fresh):
        old = OLD[page]
        fresh = fresh[1:-2] if len(fresh) >= 3 else []
        return [(o, f) for o, f in zip(old, fresh)] if len(fresh) == len(old) else None

    total, matched = 0, 0
    for page in lives:
        pr = pairs_for(page, lives[page])
        name = urllib.parse.unquote(page)[38:]
        print(('OK ' if pr is not None else 'ПРОПУСКАМ ') + f'opis={len(OLD[page])} live={len(lives[page]) - 3} {name}')
        if pr is not None:
            matched += 1
            total += len(pr)
    print(f'\nСтраници: {matched}/{len(lives)} съвпадат; снимки: {total}')
    if MODE != 'run':
        return

    os.makedirs('out', exist_ok=True)
    done, failed, seen = [], 0, set()
    for page in lives:
        # адресите на Google са подписани за кратко → отваряме страницата пак точно преди сваляне
        try:
            pr = pairs_for(page, live_images(page))
        except Exception as e:  # noqa: BLE001
            print('ГРЕШКА', page, e)
            continue
        if not pr:
            continue
        pr = [(o, f) for o, f in pr if base(o) not in seen]
        seen.update(base(o) for o, _ in pr)
        with ThreadPoolExecutor(8) as ex:
            for old, new, err in ex.map(lambda x: upload(*x), pr):
                if new:
                    done.append((old, new))
                else:
                    failed += 1
                    print('  FAIL', old[:70], err)
        print(f'… {len(done)} качени ({urllib.parse.unquote(page)[38:]})', flush=True)
    print(f'Качени: {len(done)}, неуспешни: {failed}')

    q = lambda s: "'" + s.replace("'", "''") + "'"
    cols = {'site_news': ['cover_url', 'gallery_images', 'content'], 'site_pages': ['photos', 'body'], 'site_settings': ['value']}
    with open('out/images.sql', 'w', encoding='utf-8') as f:
        for old, new in done:
            for variant in sorted({old, sized(old)}):
                for t, cs in cols.items():
                    for c in cs:
                        f.write(f'UPDATE {t} SET {c} = REPLACE({c}, {q(variant)}, {q(new)}) WHERE instr({c}, {q(variant)}) > 0;\n')
    print('Записан out/images.sql')


if __name__ == '__main__':
    main()
