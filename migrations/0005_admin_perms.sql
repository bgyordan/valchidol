-- Права на редакторите по раздели (отметки в Админ → Хора), напр. „novini,sabitiya“.
-- NULL = всички раздели (както досега). Главният админ винаги може всичко.
ALTER TABLE admin_users ADD COLUMN perms TEXT;
