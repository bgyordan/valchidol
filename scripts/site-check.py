"""Помощни проверки, пускат се от Actions → Old site images.

  python3 -I scripts/site-check.py logo    # логото от стария Google сайт → R2 site/logo-star.* и base64 в лога
  python3 -I scripts/site-check.py photos  # размерите на избраните снимки (начална страница) в R2
"""
import base64, json, os, re, subprocess, sys, urllib.parse, urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
BUCKET = 'souvalchidol-files'
HOME = 'https://sites.google.com/view/suvasillevski/начало'
IMG = re.compile(r'https://(?:sites\.google\.com/sitesv-images-rt|lh\d\.googleusercontent\.com)/[A-Za-z0-9_\-=./%]+')


def get(url):
    p = urllib.parse.urlsplit(url)
    url = urllib.parse.urlunsplit((p.scheme, p.netloc, urllib.parse.quote(p.path), p.query, ''))
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read(), r.headers.get('Content-Type', '')


def size(data):
    """(ширина, височина) за PNG/JPEG без външни библиотеки."""
    if data[:8] == b'\x89PNG\r\n\x1a\n':
        return int.from_bytes(data[16:20], 'big'), int.from_bytes(data[20:24], 'big')
    i = 2
    while i < len(data) - 9:
        if data[i] != 0xFF:
            i += 1
            continue
        m = data[i + 1]
        if m in (0xC0, 0xC1, 0xC2):
            return int.from_bytes(data[i + 7:i + 9], 'big'), int.from_bytes(data[i + 5:i + 7], 'big')
        i += 2 + int.from_bytes(data[i + 2:i + 4], 'big')
    return None


def logo():
    old = json.load(open('scripts/old-images.json', encoding='utf-8'))
    page = next(p for p in old if p != 'COMMON')
    for src in [HOME, page]:
        try:
            html = get(src)[0].decode('utf-8', 'replace')
            break
        except Exception as e:  # noqa: BLE001
            print('не се отваря', src, e)
    html = html.replace('\\u003d', '=').replace('\\/', '/').replace('&amp;', '&')
    seen, imgs = set(), []
    for u in IMG.findall(html):
        b = re.sub(r'=[whsp][0-9A-Za-z\-]*$', '', u)
        if b not in seen:
            seen.add(b)
            imgs.append(b)
    print('снимки на страницата:', len(imgs))
    # логото е най-отгоре (в заглавната лента); пробваме първите няколко и показваме размерите
    for k, b in enumerate(imgs[:4]):
        data, ct = get(b + '=s0')  # =s0 → оригиналният размер
        print(k, ct, len(data), size(data))
        ext = '.png' if 'png' in ct else '.jpg'
        name = f'site/logo-star-{k}{ext}'
        with open('/tmp/l' + ext, 'wb') as f:
            f.write(data)
        subprocess.run(['npx', 'wrangler', 'r2', 'object', 'put', f'{BUCKET}/{name}', '--file', '/tmp/l' + ext, '--content-type', ct.split(';')[0], '--remote'], check=True, capture_output=True)
        print('  → /files/' + name)
        if k == 0 and len(data) < 400_000:
            s = base64.b64encode(data).decode()
            print('BASE64-START')
            for i in range(0, len(s), 1000):
                print('B64 ' + s[i:i + 1000])
            print('BASE64-END')


def photos():
    out = subprocess.run(['npx', 'wrangler', 'd1', 'execute', 'souvalchidol', '--remote', '--json', '--command',
                          "SELECT key, value FROM site_settings WHERE key IN ('hero_photos','page_photos')"], capture_output=True, text=True, check=True).stdout
    rows = json.loads(out)[0]['results']
    urls = []
    for r in rows:
        v = json.loads(r['value'])
        if isinstance(v, list):
            urls += [(r['key'], u) for u in v]
        else:
            for k, l in v.items():
                urls += [(k, u) for u in l]
    for key, u in urls:
        if not u.startswith('/files/'):
            print(key, 'външна', u[:80])
            continue
        subprocess.run(['npx', 'wrangler', 'r2', 'object', 'get', f'{BUCKET}/{u[7:]}', '--file', '/tmp/p', '--remote'], capture_output=True)
        data = open('/tmp/p', 'rb').read() if os.path.exists('/tmp/p') else b''
        print(key, u, len(data), size(data))


if __name__ == '__main__':
    {'logo': logo, 'photos': photos}[sys.argv[1]]()
