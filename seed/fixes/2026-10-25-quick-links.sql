-- Бързите връзки на началната без повторения с бутоните горе (е-дневник, контакти).
-- Пипа само запазени настройки, в които още е старият е-дневник; иначе остават стойностите от кода.
UPDATE site_settings SET value = json_set(value, '$.quick', json('[{"t": "Прием", "href": "/priem", "icon": "cap"}, {"t": "Прозрачност и бюджет", "href": "/dokumentatsiya#Бюджет", "icon": "chart"}, {"t": "Графици", "href": "/dokumentatsiya#Графици", "icon": "calendar"}, {"t": "Заявления и бланки", "href": "/zayavleniya", "icon": "form"}, {"t": "Стипендии", "href": "/stipendii", "icon": "coin"}, {"t": "Свободни места", "href": "/svobodni-mesta", "icon": "seat"}]'))
WHERE key = 'home' AND instr(value, 'app.shkolo.bg') > 0;
