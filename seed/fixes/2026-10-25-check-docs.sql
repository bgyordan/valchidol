-- read. Само четене: документите и текстовете на „Достъп до информация“, „Административни услуги“ и „Лични данни“.
SELECT section, category, academic_year, archived, sort_order, name, file_url FROM site_documents
 WHERE section IN ('dostap-do-informatsiya', 'administrativni-uslugi', 'lichni-danni') ORDER BY section, category, sort_order;
SELECT slug, title, body FROM site_pages WHERE slug IN ('dostap-do-informatsiya', 'administrativni-uslugi', 'lichni-danni');
