-- По-малко прочетени редове в D1 (безплатният лимит е 5 млн. реда на ден):
-- датата „Последна промяна“ във футъра (MAX(created_at)) четеше всички документи при всяко отваряне.
CREATE INDEX IF NOT EXISTS site_documents_created ON site_documents (created_at);
-- рубриките на новините в менюто
CREATE INDEX IF NOT EXISTS site_news_cat ON site_news (status, category);
