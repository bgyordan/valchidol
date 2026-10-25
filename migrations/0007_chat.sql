-- Чатботът: брой въпроси на ден (общо и от един адрес), за да не се надхвърли безплатният лимит на Cloudflare.
-- Адресът се пази само като съкратен хеш и само за деня; самите въпроси не се записват.
CREATE TABLE chat_usage (
  day TEXT NOT NULL,
  who TEXT NOT NULL,          -- '*' = общо за деня, иначе хеш на адреса
  n   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, who)
);
