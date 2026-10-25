-- Имената на документите без markdown знаците от стария сайт („##### …“, „**…**“). Може да се пуска повече от веднъж.
UPDATE site_documents SET name = trim(ltrim(name, '# ')) WHERE name LIKE '#%';
UPDATE site_documents SET name = trim(replace(name, '**', '')) WHERE name LIKE '%**%';
