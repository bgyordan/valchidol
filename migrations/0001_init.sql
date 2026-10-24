-- Начална схема на базата на сайта (Cloudflare D1 / SQLite).
-- Датите са ISO текст (UTC), напр. '2026-10-24T09:00:00.000Z'; JSON полетата са текст.

CREATE TABLE site_news (
  id            TEXT PRIMARY KEY,               -- и адрес на статията: /novini/<id>
  title         TEXT NOT NULL,
  excerpt       TEXT,
  content       TEXT,
  cover_url     TEXT,
  gallery_images TEXT NOT NULL DEFAULT '[]',     -- JSON масив от адреси
  category      TEXT NOT NULL DEFAULT 'news',
  status        TEXT NOT NULL DEFAULT 'draft',   -- draft | published
  published_at  TEXT,
  author_name   TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX site_news_pub ON site_news (status, published_at);

CREATE TABLE site_events (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  event_date  TEXT NOT NULL,                     -- 'YYYY-MM-DD'
  event_time  TEXT,
  location    TEXT,
  description TEXT
);
CREATE INDEX site_events_date ON site_events (event_date);

CREATE TABLE gallery_albums (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  cover_url  TEXT,
  event_date TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE gallery_photos (
  id         TEXT PRIMARY KEY,
  album_id   TEXT NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  photo_url  TEXT NOT NULL,
  caption    TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX gallery_photos_album ON gallery_photos (album_id, sort_order);

-- 'hero_photos' → ["url", ...];  'page_photos' → { "za-nas": ["url", ...], ... }
CREATE TABLE site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL                             -- JSON
);

CREATE TABLE site_documents (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  file_url      TEXT NOT NULL,                    -- обикновено файл в R2
  academic_year TEXT,
  section       TEXT NOT NULL,
  category      TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  on_site       INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX site_documents_section ON site_documents (section, academic_year, sort_order);

-- grp: admin | teachers | educators | assistants | other ...
CREATE TABLE team_members (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  grp   TEXT NOT NULL,
  title TEXT,
  sort  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE site_jobs (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  employment   TEXT,
  description  TEXT,
  requirements TEXT,
  location     TEXT,
  status       TEXT NOT NULL DEFAULT 'active',    -- active | closed
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE job_subscribers (
  email      TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
