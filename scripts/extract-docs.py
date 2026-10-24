"""Еднократно: връзките към файлове в текста на страниците (site_pages.body) → таблица site_documents.

От стария Google сайт документите са дълги списъци „- [Име](https://drive.google.com/...)“ в текста.
Скриптът ги вади в site_documents (страница, учебна година, група = най-близкото заглавие, ред)
и ги маха от текста. Заглавия, под които не е останал текст, също се махат.
Пускане повторно не прави нищо ново — връзките вече ги няма в текста.

  python3 -I scripts/extract-docs.py <pages.json> [dry|run]

pages.json е изходът на `wrangler d1 execute --json --command "SELECT slug, body FROM site_pages"`
(или seed/old-site.json за проба). При run пише out/docs.sql.
"""
import json
import os
import re
import sys
import uuid

DOC = re.compile(r'drive\.google\.com|docs\.google\.com|\.(pdf|docx?|xlsx?|pptx?|odt|ods|rtf|zip)(\?|#|$)', re.I)
LINK = re.compile(r'\[([^\]]*)\]\(([^)\s]+)\)')
BULLET = re.compile(r'^\s*(?:[-*+]|\d+[.)])\s+')
HEAD = re.compile(r'^\s*(#{1,6})\s+(.+?)\s*#*\s*$')
# страници, които са само списъци с документи: там ред без връзка също е документ (файлът липсва)
NOFILE_PAGES = {'dokumentatsiya', 'sfo'}
YEAR = re.compile(r'(?:19|20)\d\d(?:\s*[-/–—]\s*(?:(?:19|20)?\d\d))?')


def year_label(text: str):  # като label() в lib/years.ts
    m = YEAR.search(text)
    if not m:
        return None
    parts = re.split(r'\s*[-/–—]\s*', m.group(0))
    a = parts[0]
    if len(parts) < 2:
        return a
    b = parts[1]
    return f'{a}/{a[:2] + b if len(b) == 2 else b}'


def clean(t: str) -> str:
    t = re.sub(r'[*_`]+', '', t).strip(' :.-–—\t')
    return re.sub(r'\s+', ' ', t)


def heading(t: str) -> str:
    t = clean(t)
    letters = [c for c in t if c.isalpha()]
    # „УЧИЛИЩНА ДОКУМЕНТАЦИЯ“ → „Училищна документация“
    if letters and sum(c.isupper() for c in letters) / len(letters) > 0.8:
        t = t[:1].upper() + t[1:].lower()
    return t


def year_level(lines):
    """Нивото на заглавията с години (както splitByYears): ## или ###, което има поне две."""
    for lv in (2, 3):
        n = 0
        for l in lines:
            h = HEAD.match(l)
            if h and len(h.group(1)) == lv and not h.group(2).startswith('[') and year_label(h.group(2)):
                n += 1
        if n >= 2:
            return lv
    return None


def docs_from_line(line: str):
    """Ред от списък (или само връзка), който е документ → [(име, адрес)], иначе None."""
    links = LINK.findall(line)
    if not links or not any(DOC.search(u) for _, u in links):
        return None
    rest = LINK.sub('', line)
    is_bullet = bool(BULLET.match(line))
    if not is_bullet and len(re.sub(r'[\s.,;:]', '', rest)) > 12:
        return None  # връзка в средата на изречение — остава в текста (кратко „ИУЧ“ след нея е част от името)
    if any(not DOC.search(u) for _, u in links):
        return None  # смесено с обикновени връзки — остава
    full = clean(BULLET.sub('', LINK.sub(lambda m: m.group(1), line)))
    urls = []
    for _, u in links:
        if u not in urls:
            urls.append(u)
    if len(urls) == 1:
        return [(full or clean(links[0][0]) or 'Документ', urls[0])]
    # няколко различни файла на един ред: „График… [- начален етап](…) [- прогимназиален](…)“
    first = clean(links[0][0])
    out = []
    for u in urls:
        texts = [clean(t) for t, x in links if x == u]
        name = ' '.join(t for t in texts if t)
        out.append((name if u == links[0][1] else f'{first} – {name}'.strip(' –') or first, u))
    return out


def process(slug: str, body: str):
    body = body.replace('\r', '')
    # име на връзка, пренесено на нов ред: „[Присъствено обучение\nот I до IV клас](…)“
    body = re.sub(r'\[([^\]\n]*)\n([^\]\n]*)\]\(', r'[\1 \2](', body)
    lines = body.split('\n')
    lv = year_level(lines)
    year, cat, keep, docs = None, None, [], []
    for l in lines:
        h = HEAD.match(l)
        if h:
            level, text = len(h.group(1)), h.group(2)
            found = docs_from_line(text)
            if found:  # заглавието само е връзка към файл („### [Заповед](…)“) → документ
                for name, url in found:
                    docs.append({'name': name[:300], 'url': url, 'year': year, 'cat': (cat or None) and cat[:60], 'line': len(keep)})
                continue
            y = year_label(text) if lv and level == lv and not text.startswith('[') else None
            if y:
                year, cat = y, None
                rest = heading(YEAR.sub('', re.sub(r'учебна|година|г\.', '', text, flags=re.I)))
                if rest:
                    cat = rest  # „ПЛАН-ПРИЕМ 2026/2027“ → група „План-прием“
            elif lv and level < lv:
                year, cat = None, heading(text)
            else:
                cat = heading(text)
            keep.append(l)
            continue
        found = docs_from_line(l)
        if found:
            for name, url in found:
                docs.append({'name': name[:300], 'url': url, 'year': year, 'cat': (cat or None) and cat[:60], 'line': len(keep)})
            continue
        # ред от списък без връзка („- Етичен кодекс…“) — документ, чийто файл липсва; решава се по-долу
        if slug in NOFILE_PAGES and BULLET.match(l) and '](' not in l and 3 <= len(clean(BULLET.sub('', l))) <= 250:
            keep.append(('?', l, year, (cat or None) and cat[:60]))
            continue
        keep.append(l)
    # редовете без файл стават документи само ако в същата година и група има истински документи
    # (на страниците-списъци — винаги)
    groups = {(x['year'], x['cat']) for x in docs}
    out = []
    for i, k in enumerate(keep):
        if isinstance(k, tuple):
            _, l, y, c = k
            if (y, c) in groups or slug in NOFILE_PAGES:
                docs.append({'name': clean(BULLET.sub('', l))[:300], 'url': '', 'year': y, 'cat': c, 'line': i})
                continue
            out.append(l)
        else:
            out.append(k)
    docs.sort(key=lambda x: x['line'])  # редът като в стария текст
    return tidy(out), docs


def tidy(lines):
    """Маха заглавията, под които (до следващото заглавие на същото или по-горно ниво) няма текст."""
    out = []
    for i, l in enumerate(lines):
        h = HEAD.match(l)
        if h:
            level = len(h.group(1))
            has = False
            for m in lines[i + 1:]:
                hm = HEAD.match(m)
                if hm and len(hm.group(1)) <= level:
                    break
                if not hm and m.strip():
                    has = True
                    break
            if not has:
                continue
        out.append(l)
    text = '\n'.join(out)
    return re.sub(r'\n{3,}', '\n\n', text).strip()


def load(path):
    d = json.load(open(path, encoding='utf-8'))
    if isinstance(d, dict) and 'pages' in d:
        return d['pages']
    if isinstance(d, list) and d and 'results' in d[0]:
        return d[0]['results']
    return d


def main():
    path, mode = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else 'dry')
    q = lambda s: 'NULL' if s is None else "'" + str(s).replace("'", "''") + "'"
    sql, total = [], 0
    for p in load(path):
        slug, body = p['slug'], p.get('body') or ''
        new_body, docs = process(slug, body)
        seen, uniq = set(), []
        for x in docs:
            k = (x['url'] or 'name:' + x['name'], x['year'])
            if k not in seen:
                seen.add(k)
                uniq.append(x)
        if not uniq:
            continue
        total += len(uniq)
        cats = sorted({x['cat'] or '—' for x in uniq})
        years = sorted({x['year'] or '—' for x in uniq}, reverse=True)
        print(f'{slug}: {len(uniq)} документа; години: {", ".join(years[:6])}{"…" if len(years) > 6 else ""}; групи: {len(cats)}'
              f'; текст {len(body)} → {len(new_body)} знака')
        for i, x in enumerate(uniq):
            # без двойни записи, ако файлът се пусне два пъти
            sql.append(
                'INSERT INTO site_documents (id, name, file_url, academic_year, section, category, sort_order, on_site) '
                f'SELECT {q(str(uuid.uuid4()))}, {q(x["name"])}, {q(x["url"])}, {q(x["year"])}, {q(slug)}, {q(x["cat"])}, {(i + 1) * 10}, 1 '
                f'WHERE NOT EXISTS (SELECT 1 FROM site_documents WHERE section = {q(slug)} AND file_url = {q(x["url"])} '
                f'AND name = {q(x["name"])} AND IFNULL(academic_year, \'\') = {q(x["year"] or "")});')
        sql.append(f'UPDATE site_pages SET body = {q(new_body)} WHERE slug = {q(slug)};')
    print(f'\nОбщо: {total} документа')
    if mode == 'run':
        os.makedirs('out', exist_ok=True)
        with open('out/docs.sql', 'w', encoding='utf-8') as f:
            f.write('\n'.join(sql) + '\n')
        print('Записан out/docs.sql')
    elif mode == 'show':
        # проба: показва новия текст и документите на една страница
        slug = sys.argv[3]
        for p in load(path):
            if p['slug'] == slug:
                nb, docs = process(slug, p['body'])
                print(nb[:3000])
                print('-----')
                for x in docs[:80]:
                    print(x['year'], '|', x['cat'], '|', x['name'][:90])


if __name__ == '__main__':
    main()
