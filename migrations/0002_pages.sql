-- Текстови страници на сайта (история, документация, прием, СФО ...). Редактират се от /admin/stranitsi.
CREATE TABLE site_pages (
  slug       TEXT PRIMARY KEY,               -- адресът: /<slug>, напр. 'istoriya' или 'proekti/raven-dostap'
  title      TEXT NOT NULL,
  grp        TEXT,                            -- група в менюто: uchilishte | roditeli | uchenitsi | uchiteli | dokumenti | novini | proekti
  body       TEXT NOT NULL DEFAULT '',        -- текст във формата на редактора (## заглавие, - списък, [връзка](адрес))
  photos     TEXT NOT NULL DEFAULT '[]',      -- JSON масив от адреси на снимки
  sort       INTEGER NOT NULL DEFAULT 0,
  old_url    TEXT,                            -- адресът в стария сайт (Google Sites)
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX site_pages_grp ON site_pages (grp, sort);
