-- read. Само четене: документи и страници с „#“ в началото на името.
SELECT section, name FROM site_documents WHERE name LIKE '#%' OR name LIKE '%####%' LIMIT 200;
SELECT slug, title FROM site_pages WHERE title LIKE '#%';
