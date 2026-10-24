"""Еднократно: файловете на документите от стария хостинг (souvalchidol.com/files) и от Google Drive → R2.

  python3 -I scripts/migrate-files.py probe|run souvalchidol|drive|all <docs.json> [pages.json news.json …]

Файловете са изходи на `wrangler d1 execute --json` (документи, текстове на страници, новини).
probe: проверява по няколко файла от всеки вид (дали се свалят и какви са).
run: сваля всеки файл, качва го в R2 под dokumenti/stari/ и пише out/files.sql, което сменя адресите
в site_documents, в текста на страниците и в новините. Файл, който не се сваля, остава със стария адрес.
"""
import hashlib
import json
import os
import random
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

BUCKET = 'souvalchidol-files'
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
EXT = {
    'application/pdf': '.pdf', 'application/msword': '.doc', 'application/vnd.ms-excel': '.xls',
    'application/vnd.ms-powerpoint': '.ppt', 'application/zip': '.zip', 'application/rtf': '.rtf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'image/jpeg': '.jpg', 'image/png': '.png',
}


def kind(u: str):
    if re.search(r'souvalchidol\.com/', u):
        return 'souvalchidol'
    if 'drive.google.com' in u or 'docs.google.com' in u:
        return 'drive'
    return None


def source(u: str) -> str:
    """Адресът, от който файлът се сваля направо (без страницата за преглед на Drive)."""
    m = re.search(r'docs\.google\.com/(document|spreadsheets|presentation)/d/([\w-]+)', u)
    if m:
        fmt = {'document': 'pdf', 'spreadsheets': 'xlsx', 'presentation': 'pdf'}[m.group(1)]
        return f'https://docs.google.com/{m.group(1)}/d/{m.group(2)}/export?format={fmt}'
    m = re.search(r'/file/d/([\w-]+)', u) or re.search(r'[?&]id=([\w-]+)', u)
    if m and 'google.com' in u:
        return f'https://drive.usercontent.google.com/download?id={m.group(1)}&export=download&confirm=t'
    p = urllib.parse.urlsplit(u)
    return urllib.parse.urlunsplit((p.scheme, p.netloc, urllib.parse.quote(urllib.parse.unquote(p.path)), p.query, ''))


def fetch(u: str):
    req = urllib.request.Request(source(u), headers=UA)
    with urllib.request.urlopen(req, timeout=90) as r:
        data = r.read()
        ctype = (r.headers.get('Content-Type') or '').split(';')[0].strip().lower()
        disp = r.headers.get('Content-Disposition') or ''
    if ctype.startswith('text/html'):
        raise RuntimeError('страница вместо файл (вероятно не е споделен публично)')
    m = re.search(r"filename\*=UTF-8''([^;]+)|filename=\"?([^\";]+)", disp)
    name = urllib.parse.unquote((m.group(1) or m.group(2)) if m else urllib.parse.urlsplit(u).path.rsplit('/', 1)[-1])
    ext = os.path.splitext(name)[1].lower()
    if not re.fullmatch(r'\.[a-z0-9]{2,5}', ext or ''):
        ext = EXT.get(ctype, '.pdf')
    return data, ctype or 'application/octet-stream', ext


URL = re.compile(r'https?://[^\s)\]"\'<>]+')


def load(paths):
    """Всички адреси на файлове от изходите на wrangler (документи, страници, новини)."""
    out = set()
    for path in paths:
        d = json.load(open(path, encoding='utf-8'))
        rows = d[0]['results'] if isinstance(d, list) and d and 'results' in d[0] else d
        for r in rows:
            for v in r.values():
                if isinstance(v, str):
                    out.update(u.rstrip('.,;') for u in URL.findall(v))
    return sorted(out)


def main():
    mode, which, paths = sys.argv[1], sys.argv[2], sys.argv[3:]
    urls = [u for u in load(paths) if kind(u) and (which == 'all' or kind(u) == which)]
    # папки и страници на Drive не са файлове
    urls = [u for u in urls if not re.search(r'drive\.google\.com/(drive/)?(folders|u/\d/folders)|/drive/my-drive', u)]
    by = {}
    for u in urls:
        by.setdefault(kind(u), []).append(u)
    print({k: len(v) for k, v in by.items()})

    if mode == 'probe':
        random.seed(1)
        for k, lst in by.items():
            for u in random.sample(lst, min(6, len(lst))):
                try:
                    data, ctype, ext = fetch(u)
                    print(f'OK   {k} {len(data):>9} {ctype} {ext}  {u[:90]}')
                except Exception as e:  # noqa: BLE001
                    print(f'FAIL {k} {e}  {u[:90]}')
        return

    os.makedirs('out/f', exist_ok=True)

    def one(u):
        try:
            data, ctype, ext = fetch(u)
        except Exception as e:  # noqa: BLE001
            return u, None, f'сваляне: {e}'
        key = 'dokumenti/stari/' + hashlib.sha1(u.encode()).hexdigest()[:16] + ext
        tmp = os.path.join('out/f', key.replace('/', '_'))
        with open(tmp, 'wb') as f:
            f.write(data)
        r = subprocess.run(['npx', 'wrangler', 'r2', 'object', 'put', f'{BUCKET}/{key}', '--file', tmp,
                            '--content-type', ctype, '--remote'], capture_output=True, text=True)
        os.remove(tmp)
        if r.returncode:
            return u, None, 'R2: ' + r.stderr[-200:]
        return u, '/files/' + key, None

    done, failed = [], {}
    with ThreadPoolExecutor(8) as ex:
        for i, (u, new, err) in enumerate(ex.map(one, urls), 1):
            if new:
                done.append((u, new))
            else:
                failed[u] = err
            if i % 100 == 0:
                print(f'… {i}/{len(urls)}: качени {len(done)}, неуспешни {len(failed)}', flush=True)
    print(f'Качени: {len(done)}, неуспешни: {len(failed)}')
    reasons = {}
    for u, e in failed.items():
        reasons.setdefault(e[:80], []).append(u)
    for e, lst in sorted(reasons.items(), key=lambda x: -len(x[1])):
        print(f'  {len(lst):4} × {e}   напр. {lst[0][:90]}')

    q = lambda s: "'" + s.replace("'", "''") + "'"
    with open('out/files.sql', 'w', encoding='utf-8') as f:
        for old, new in done:
            f.write(f'UPDATE site_documents SET file_url = {q(new)} WHERE file_url = {q(old)};\n')
            f.write(f'UPDATE site_pages SET body = REPLACE(body, {q(old)}, {q(new)}) WHERE instr(body, {q(old)}) > 0;\n')
            f.write(f'UPDATE site_news SET content = REPLACE(content, {q(old)}, {q(new)}) WHERE instr(content, {q(old)}) > 0;\n')
    print('Записан out/files.sql')


if __name__ == '__main__':
    main()
