-- Вход в админ панела: служителите и техните сесии (вместо Cloudflare Access).
CREATE TABLE admin_users (
  email         TEXT PRIMARY KEY,               -- с малки букви
  name          TEXT,
  pass_hash     TEXT NOT NULL,                  -- pbkdf2$<итерации>$<сол>$<хеш>
  role          TEXT NOT NULL DEFAULT 'editor', -- admin (управлява хората) | editor
  failed        INTEGER NOT NULL DEFAULT 0,     -- грешни опити подред
  locked_until  TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_login    TEXT
);

CREATE TABLE admin_sessions (
  token_hash  TEXT PRIMARY KEY,                 -- SHA-256 на бисквитката
  email       TEXT NOT NULL REFERENCES admin_users(email) ON DELETE CASCADE,
  expires_at  TEXT NOT NULL
);
CREATE INDEX admin_sessions_email ON admin_sessions (email);
