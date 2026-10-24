-- 2026-10-25: групите в Документация — сливане на почти еднаквите и подреждане
UPDATE site_documents SET category = 'Бюджет' WHERE section = 'dokumentatsiya' AND category = 'Бюджет 2020';
UPDATE site_documents SET category = 'Графици' WHERE section = 'dokumentatsiya' AND category = 'Графици и списъци';
UPDATE site_documents SET category = 'Училищни учебни планове' WHERE section = 'dokumentatsiya' AND category = 'Учебна документация';
UPDATE site_documents SET category = 'Училищна документация' WHERE section = 'dokumentatsiya' AND category IS NULL;
-- редът на групите: Училищна документация, Бюджет, Графици, Заповеди, Учебни планове, Комисии
UPDATE site_documents SET sort_order = sort_order % 100000 + 100000 WHERE section = 'dokumentatsiya' AND category = 'Бюджет';
UPDATE site_documents SET sort_order = sort_order % 100000 + 200000 WHERE section = 'dokumentatsiya' AND category = 'Графици';
UPDATE site_documents SET sort_order = sort_order % 100000 + 300000 WHERE section = 'dokumentatsiya' AND category = 'Заповеди';
UPDATE site_documents SET sort_order = sort_order % 100000 + 400000 WHERE section = 'dokumentatsiya' AND category = 'Училищни учебни планове';
UPDATE site_documents SET sort_order = sort_order % 100000 + 500000 WHERE section = 'dokumentatsiya' AND category = 'Комисии и работни групи';
-- отрязани имена на групи от стария сайт
UPDATE site_documents SET category = 'Прием в осми клас' WHERE section = 'priem' AND instr(category, 'в осми клас') > 0;
UPDATE site_documents SET category = 'Прием в първи клас' WHERE section = 'priem' AND instr(category, 'в първи клас') > 0;
UPDATE site_documents SET category = 'Прием' WHERE section = 'arhiv-2022-2023' AND instr(category, 'Прием на ученици') = 1;
UPDATE site_documents SET category = 'Мобилни приложения' WHERE section = 'za-uchenika' AND instr(category, 'мобилни приложения') > 0;
UPDATE site_documents SET category = NULL WHERE section = 'parlament' AND category = 'гр. Вълчи дол';
