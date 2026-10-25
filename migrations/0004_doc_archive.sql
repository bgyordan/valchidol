-- Архив на документите: на сайта и в админа отпред са само текущите, а миналите години са в „Архив“.
ALTER TABLE site_documents ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;

-- в началото: всичко от по-стари години на всяка страница отива в архива (най-новата година на страницата остава)
UPDATE site_documents SET archived = 1
WHERE academic_year IS NOT NULL AND academic_year <> ''
  AND academic_year < (SELECT MAX(d2.academic_year) FROM site_documents d2 WHERE d2.section = site_documents.section);
