-- Английска версия: страница, която има title_en и body_en, се показва и на /en/<адрес>.
ALTER TABLE site_pages ADD COLUMN title_en TEXT;
ALTER TABLE site_pages ADD COLUMN body_en TEXT;
