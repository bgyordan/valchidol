#!/usr/bin/env python3
"""Пренася описа на стария сайт (Google Sites) в данни за новия сайт.

Вход:  описът в Markdown (star-sait-opis.md)
Изход: seed/old-site.json (за преглед) и seed/old-site.sql (за D1)

  python3 scripts/import-old-site.py път/до/star-sait-opis.md
  npx wrangler d1 execute souvalchidol --local --file seed/old-site.sql
"""
import json, re, sys, unicodedata
from pathlib import Path
from urllib.parse import unquote

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / 'seed'
BASE = 'https://sites.google.com/view/suvasillevski/'

# стар адрес (след /suvasillevski/) → нов адрес, заглавие, група в менюто
PAGES = {
    'училище/обществен-съвет': ('obshtestven-savet', 'Обществен съвет', 'uchilishte'),
    'училище/училищно-настоятелство': ('uchilishtno-nastoyatelstvo', 'Училищно настоятелство', 'uchilishte'),
    'за-родители/документация': ('dokumentatsiya', 'Документация', 'dokumenti'),
    'училище/административни-услуги': ('administrativni-uslugi', 'Административни услуги', 'dokumenti'),
    'училище/парламент': ('parlament', 'Ученически парламент', 'uchenitsi'),
    'училище/лични-данни': ('lichni-danni', 'Лични данни', 'dokumenti'),
    'училище/достъп-до-обществена-информация': ('dostap-do-informatsiya', 'Достъп до обществена информация', 'dokumenti'),
    'училище/документи-за-организиране-на-пътуване-екскурзия-лагери-състезания': ('patuvaniya', 'Документи за пътувания, екскурзии и лагери', 'roditeli'),
    'училище/библиотека': ('biblioteka', 'Библиотека', 'uchilishte'),
    'училище/вестник': ('vestnik', 'Училищни вестници', 'uchilishte'),
    'училище/радио': ('radio', 'Училищно радио', 'uchilishte'),
    'училище/бдп': ('bdp', 'Безопасност на движението', 'roditeli'),
    'училище/поздравителни-адреси': ('pozdravitelni-adresi', 'Поздравителни адреси', 'novini'),
    'прием': ('priem', 'Прием', 'roditeli'),
    'за-родители': ('za-roditeli', 'За родители', 'roditeli'),
    'за-родители/сфо': ('sfo', 'Самостоятелна форма на обучение', 'uchenitsi'),
    'за-родители/родителски-клуб': ('roditelski-klub', 'Родителски клуб', 'roditeli'),
    'за-ученика': ('za-uchenika', 'За ученика', 'uchenitsi'),
    'за-ученика/занимания-по-интереси': ('zanimaniya-po-interesi', 'Занимания по интереси', 'uchenitsi'),
    'за-ученика/стипендии': ('stipendii', 'Стипендии', 'uchenitsi'),
    'за-ученика/постижения': ('postizheniya', 'Постижения', 'uchenitsi'),
    'за-ученика/заявления': ('zayavleniya', 'Заявления и бланки', 'roditeli'),
    'за-ученика/анализ-от-нво-и-дзи': ('analiz-nvo-dzi', 'Анализ от НВО и ДЗИ', 'uchenitsi'),
    'за-ученика/омбудсман': ('ombudsman', 'Ученически омбудсман', 'uchenitsi'),
    'за-ученика/свободни-места-за-ученици': ('svobodni-mesta', 'Свободни места за ученици', 'roditeli'),
    'за-учителя': ('za-uchitelya', 'За учителя', 'uchiteli'),
    'за-учителя/критерии-за-допълнително-трудово-възнаграждение': ('kriterii-dtv', 'Критерии за допълнително трудово възнаграждение', 'uchiteli'),
    'за-учителя/професионални-общности': ('profesionalni-obshtnosti', 'Професионални общности', 'uchiteli'),
    'за-учителя/организиране-на-екскурзии-лагери-състезания-и-други': ('organizirane-na-ekskurzii', 'Организиране на екскурзии, лагери и състезания', 'uchiteli'),
    'проекти': ('proekti', 'Проекти', 'uchilishte'),
    'патрон-и-символи': ('patron-i-simvoli', 'Патрон и символи', 'uchilishte'),
    'патрон-и-символи/история': ('istoriya', 'История', 'uchilishte'),
    'патрон-и-символи/мисия-и-цели': ('misiya-i-tseli', 'Мисия и цели', 'uchilishte'),
    'патрон-и-символи/визия': ('viziya', 'Визия', 'uchilishte'),
    'акценти': ('aktsenti', 'Акценти', 'novini'),
    'галерия': ('galeriya-arhiv', 'Галерия (архив)', 'novini'),
    'архив-2022-2023': ('arhiv-2022-2023', 'Архив 2022/2023', 'novini'),
    'архив': ('arhiv-2021-2022', 'Архив 2021/2022', 'novini'),
    'секциянп': ('proekti/np-lichnostno-razvitie', 'НП „Подкрепа за личностно развитие на децата и учениците“ 2023', 'proekti'),
    'секцияпзч': ('proekti/uchilishta-za-primer', 'Програма „Училища за пример“ на Фондация „Заедно в час“', 'proekti'),
    'секцияп': ('proekti/bibliotekite-kato-sreda', 'Модул „Библиотеките като образователна среда“', 'proekti'),
    'секцияп1': ('proekti/uchenicheski-praktiki-2', 'Проект „Ученически практики – 2“', 'proekti'),
    'секцияп2': ('proekti/raven-dostap', '„Равен достъп до училищно образование в условията на кризи“', 'proekti'),
    'секцияп3': ('proekti/obrazovanie-za-utreshniya-den', 'Проект „Образование за утрешния ден“', 'proekti'),
    'секцияп4': ('proekti/priobshtavashto-obrazovanie', 'Проект „Подкрепа за приобщаващо образование“', 'proekti'),
}
# страници, които новият сайт прави сам (не се пренасят като текстови)
LINK_ONLY = {'начало': '/', 'училище': '/za-uchilishteto', 'контакти': '/kontakti', 'секция-актуално': '/novini', 'архив-2023-2024': '/novini'}

text = SRC.read_text(encoding='utf-8')
lines = text.split('\n')

def old_key(url: str):
    url = unquote(url.strip())
    if not url.startswith(BASE):
        return None
    return url[len(BASE):].split('#')[0].strip('/')

def new_href(url: str) -> str:
    k = old_key(url)
    if k is None:
        return url
    if k in PAGES:
        return '/' + PAGES[k][0]
    if k in LINK_ONLY:
        return LINK_ONLY[k]
    if k.startswith('секция') or k.startswith('архив'):
        return '/novini'
    return url

def fix_links(s: str) -> str:
    return re.sub(r'\]\((https://sites\.google\.com/view/suvasillevski/[^)\s]*)\)', lambda m: '](' + new_href(m.group(1)) + ')', s)

def clean_body(chunk: list[str]) -> str:
    out = []
    for l in chunk:
        l = l.rstrip()
        m = re.match(r'^(#{2,6})\s+(.*)$', l)
        if m:
            t = m.group(2).strip()
            if not t:
                continue
            l = ('## ' if len(m.group(1)) <= 4 else '### ') + t
        out.append(fix_links(l))
    s = '\n'.join(out)
    s = re.sub(r'\n{3,}', '\n\n', s).strip()
    return s

def section(chunk: list[str], name: str) -> list[str]:
    """редовете под '#### <name>' до следващото '#### ' на същото ниво, което е служебно"""
    res, on = [], False
    for l in chunk:
        if re.match(r'^#### (Текст|Документи \(\d+\)|Снимки \(\d+\)|Вградено съдържание \(\d+\))\s*$', l):
            on = l.startswith('#### ' + name)
            continue
        if on:
            res.append(l)
    return res

def sized(u: str) -> str:
    # снимките на Google Sites: =w16383 е оригиналът; за сайта стига 1600 px
    return re.sub(r'=w16383$', '=w1600', u)

def images(chunk: list[str]) -> list[str]:
    urls = []
    for l in chunk:
        m = re.match(r'^- (https?://\S+)$', l.strip())
        if m and 'gstatic.com/images/icons' not in m.group(1):
            urls.append(sized(m.group(1)))
    return urls

# ---------- страници ----------
starts = [i for i, l in enumerate(lines) if re.match(r'^### [45]\.\d+\. ', l)]
news_start = next(i for i, l in enumerate(lines) if l.startswith('## 6. '))
pages, seen = [], set()
for n, s in enumerate(starts):
    e = starts[n + 1] if n + 1 < len(starts) else news_start
    chunk = lines[s:e]
    # следващият раздел '## 5.' също прекъсва
    for j, l in enumerate(chunk[1:], 1):
        if l.startswith('## '):
            chunk = chunk[:j]; break
    addr = next((l for l in chunk if l.startswith('- **Адрес:**')), '')
    url = addr.split('**Адрес:**')[1].strip() if addr else ''
    key = old_key(url)
    if key not in PAGES or key in seen:
        continue
    seen.add(key)
    slug, title, group = PAGES[key]
    place = next((l for l in chunk if l.startswith('- **Място в менюто:**')), '')
    if not title:
        m = re.search(r'връзка „([^“]+)“', place)
        title = (m.group(1).strip() if m else slug).strip('„“" ')
        title = title[:1].upper() + title[1:].lower() if title.isupper() else title
    body_lines = section(chunk, 'Текст')
    # махаме първото заглавие, ако повтаря името на страницата
    while body_lines and not body_lines[0].strip():
        body_lines.pop(0)
    if body_lines and re.match(r'^#{2,6} ', body_lines[0]):
        body_lines.pop(0)
    body = clean_body(body_lines)
    photos = images(section(chunk, 'Снимки'))
    pages.append({'slug': slug, 'title': title, 'grp': group, 'body': body, 'photos': photos, 'old_url': url, 'sort': len(pages)})

# ---------- новини ----------
news, year = [], None
i = news_start
idx = [k for k in range(news_start, len(lines)) if lines[k].startswith('#### Новина ') or lines[k].startswith('### Учебна ')]
for n, k in enumerate(idx):
    l = lines[k]
    if l.startswith('### Учебна '):
        year = l.split('Учебна ')[1].strip(); continue
    e = idx[n + 1] if n + 1 < len(idx) else len(lines)
    chunk = lines[k:e]
    title = re.sub(r'^#### Новина \d+\.\s*', '', l).strip()
    date_l = next((x for x in chunk if x.startswith('- **Дата:**')), '')
    dm = re.search(r'(\d{1,2})\.(\d{1,2})\.(\d{4})', date_l)
    date = f'{dm.group(3)}-{int(dm.group(2)):02d}-{int(dm.group(1)):02d}' if dm else None
    body, photos, mode = [], [], 'body'
    for x in chunk[1:]:
        if x.startswith('- **Дата:**') or x.startswith('- **Страница:**') or x.strip() == '---':
            continue
        if re.match(r'^\*\*Снимки \(\d+\):\*\*', x):
            mode = 'photos'; continue
        if re.match(r'^\*\*(Документи|Вградено)', x):
            mode = 'skip'; continue
        if mode == 'photos':
            m = re.match(r'^- (https?://\S+)$', x.strip())
            if m: photos.append(sized(m.group(1)))
        elif mode == 'body':
            body.append(x)
    while body and not body[0].strip():
        body.pop(0)
    # първият ред често повтаря заглавието
    if body and re.sub(r'[#\s]', '', body[0]).endswith(re.sub(r'\s', '', title)[-20:]):
        body.pop(0)
    content = clean_body(body)
    plain = re.sub(r'[#*\[\]]|\(https?://[^)]*\)', '', content).strip()
    excerpt = re.sub(r'\s+', ' ', plain.split('\n\n')[0] if plain else '')[:220]
    news.append({'title': title, 'date': date, 'school_year': year,
                 'content': content, 'excerpt': excerpt, 'photos': photos})

# дати: без дата → между съседите (новините са подредени от най-новата), за да се запази редът
from datetime import date as D, timedelta
def parse(d): return D.fromisoformat(d) if d else None
known = [parse(x['date']) for x in news]
for k, x in enumerate(news):
    if known[k]:
        continue
    newer = next((known[j] for j in range(k - 1, -1, -1) if known[j]), None)
    older = next((known[j] for j in range(k + 1, len(news)) if known[j]), None)
    y = int((x['school_year'] or '2026/').split('/')[0])
    lo, hi = D(y, 9, 1), D(y + 1, 8, 31)
    if newer and older and older <= newer:
        guess = older + (newer - older) / 2
    elif newer:
        guess = newer - timedelta(days=1)
    elif older:
        guess = older + timedelta(days=1)
    else:
        guess = lo
    guess = min(max(guess, lo), hi)
    known[k] = guess
    x['date_guessed'] = True
for k, x in enumerate(news):
    x['date'] = known[k].isoformat()

# адрес на новината
LAT = dict(zip('абвгдежзийклмнопрстуфхцчшщъьюя', ['a','b','v','g','d','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','sht','a','y','yu','ya']))
def slugify(s):
    s = ''.join(LAT.get(c, c) for c in s.lower())
    s = unicodedata.normalize('NFKD', s)
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s)).strip('-')[:60].strip('-') or 'novina'
used = set()
for x in news:
    b = slugify(x['title']); s = b; n = 2
    while s in used: s = f'{b}-{n}'; n += 1
    used.add(s); x['id'] = s

OUT.mkdir(exist_ok=True)
(OUT / 'old-site.json').write_text(json.dumps({'pages': pages, 'news': news}, ensure_ascii=False, indent=1), encoding='utf-8')

def q(v):
    if v is None: return 'NULL'
    return "'" + str(v).replace("'", "''") + "'"
sql = ['-- Генерирано от scripts/import-old-site.py — съдържанието на стария сайт', 'DELETE FROM site_pages;', "DELETE FROM site_news WHERE author_name = 'стария сайт';"]
# D1 приема до 100 KB на заявка — дългите текстове се добавят на части
CH = 20000
for p in pages:
    parts = [p['body'][i:i + CH] for i in range(0, len(p['body']), CH)] or ['']
    sql.append(f"INSERT INTO site_pages (slug, title, grp, body, photos, sort, old_url) VALUES ({q(p['slug'])}, {q(p['title'])}, {q(p['grp'])}, {q(parts[0])}, {q(json.dumps(p['photos'], ensure_ascii=False))}, {p['sort']}, {q(p['old_url'])});")
    for part in parts[1:]:
        sql.append(f"UPDATE site_pages SET body = body || {q(part)} WHERE slug = {q(p['slug'])};")
for k, x in enumerate(news):
    # часът пази реда от стария сайт при еднакви дати (по-горе = по-късно)
    t = 12 * 60 + 97 - k
    x['time'] = f'{t // 60:02d}:{t % 60:02d}:00.000Z'
for x in news:
    cover = x['photos'][0] if x['photos'] else None
    sql.append(f"INSERT INTO site_news (id, title, excerpt, content, cover_url, gallery_images, category, status, published_at, author_name) VALUES ({q(x['id'])}, {q(x['title'])}, {q(x['excerpt'])}, {q(x['content'])}, {q(cover)}, {q(json.dumps(x['photos'][1:], ensure_ascii=False))}, 'Новини', 'published', {q(x['date'] + 'T' + x['time'])}, 'стария сайт');")
(OUT / 'old-site.sql').write_text('\n'.join(sql) + '\n', encoding='utf-8')
print(f"страници: {len(pages)}, новини: {len(news)} (без дата: {sum(1 for x in news if x.get('date_guessed'))})")
missing = [k for k in PAGES if k not in seen]
if missing: print('липсват:', missing)
