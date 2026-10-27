-- „За ученика“ на живия сайт: файловете от текста вече са документи (docs.yml), а в текста остана
-- изтеклата обява за 02.05.2024 и разхвърляни връзки (затова 0009 не се приложи — текстът беше друг).
-- 1) Текстът → групи с пояснения (## заглавия) — само ако още съдържа старата обява (РД 09-1005/19.04.2024).
-- 2) Документите → в същите групи, с почистени имена (по файла в Drive; само за тази страница).
-- Страницата показва всяка група като карта: пояснение + връзки + документите от групата.
UPDATE site_pages SET body = '## Изпити – ДЗИ и НВО

Държавните зрелостни изпити (ДЗИ) в XII клас и националното външно оценяване (НВО). Резултатите и анализите са в [Анализ от НВО и ДЗИ](/analiz-nvo-dzi).

## За абитуриентите

Какво трябва да знаят завършващите XII клас.

## Заповеди и правила

Документи на директора и правила, които всеки ученик трябва да познава.

## Безопасен интернет

Как да пазим себе си и личните си данни онлайн.

- [Сайт за безопасен интернет – направен от ученици от 10 а клас](https://sites.google.com/view/bezopaseninternet/начална-страница)
- [Национален център за безопасен интернет](https://www.safenet.bg/bg/)
- [Коалиция за медийна грамотност](https://gramoten.li/)

## При земетресение

Какво да правим и как да се държим по време на земетресение и след него.

- [Полезна информация и правила за поведение при земетресение](http://pojarna.com/земетресение/)
- [Правила за поведение при земетресение – ГДПБЗН към МВР](https://www.mvr.bg/gdpbzn/info-center/pravila-povedenie/pri-zemetresenie)

## Здраве и превенция

Информация за рисковете от наркотици и къде да потърсим помощ.

- [Рискове при употреба на наркотици – брошура на „От другата страна“](https://otdrugatastrana.org/broshura/)
- [Образователни ресурси и мобилни приложения – проект PREDICT](http://www.projectpredict.eu/oer-platform_bg.php)'
WHERE slug = 'za-uchenika' AND instr(body, 'РД 09-1005/19.04.2024') > 0;
UPDATE site_documents SET category = 'Изпити – ДЗИ и НВО', name = 'Запознаване с оценените изпитни работи от ДЗИ – XII клас', sort_order = 10 WHERE section = 'za-uchenika' AND instr(file_url, '1V3aTwpGuywnE9tQshpwDO49eGwlPzhfM') > 0;
UPDATE site_documents SET category = 'Изпити – ДЗИ и НВО', name = 'Запознаване с оценените изпитни работи от НВО – IV клас', sort_order = 20 WHERE section = 'za-uchenika' AND instr(file_url, '1YZtnCAvP-Tp8T0yx5ai94kBLFOLA5nQv') > 0;
UPDATE site_documents SET category = 'Изпити – ДЗИ и НВО', name = 'Дати за ДЗИ за професионална квалификация – теория', sort_order = 30 WHERE section = 'za-uchenika' AND instr(file_url, '1rV0azZ1oCf-1vipwLQUVr5gGX3LXrjQU') > 0;
UPDATE site_documents SET category = 'Изпити – ДЗИ и НВО', name = 'Дати за ДЗИ за професионална квалификация – практика', sort_order = 40 WHERE section = 'za-uchenika' AND instr(file_url, '17d6mE-Gk30OJAGZsUF8n0DOmxefiRNm5') > 0;
UPDATE site_documents SET category = 'Изпити – ДЗИ и НВО', name = 'Дати за ДЗИ за професионална квалификация – график', sort_order = 50 WHERE section = 'za-uchenika' AND instr(file_url, '1MZb4fy3__5NajPk8NAKx5wYEojirZJNl') > 0;
UPDATE site_documents SET category = 'За абитуриентите', name = 'Здравноосигурителни задължения на абитуриентите', sort_order = 60 WHERE section = 'za-uchenika' AND instr(file_url, '1_NP_QYhxnJEOjwgUiC0ZpC_sOdHjee-7') > 0;
UPDATE site_documents SET category = 'Заповеди и правила', name = 'Заповед № РД 07-465 / 28.01.2025 г. на директора', sort_order = 70 WHERE section = 'za-uchenika' AND instr(file_url, '1Bh1o8kl2V8xrYzyhd7wKao4EyiVaG-Nh') > 0;
UPDATE site_documents SET category = 'Заповеди и правила', name = 'Правила за оказване на първа помощ', sort_order = 80 WHERE section = 'za-uchenika' AND instr(file_url, '1vBsXb1Jr27OyrFrOm6AfV95pgbmJotdI') > 0;
UPDATE site_documents SET category = 'Безопасен интернет', name = 'Правила за безопасна работа в училищната мрежа и в интернет', sort_order = 90 WHERE section = 'za-uchenika' AND instr(file_url, '1UNnly_HDtMBNmbaqqeT9n2Bfcsa9I_eb') > 0;
UPDATE site_documents SET category = 'Здраве и превенция', name = '„Животът е безценен! Не го заменяй за дрога!“', sort_order = 100 WHERE section = 'za-uchenika' AND instr(file_url, '1WgDUNgKOT8C5O1KMT2SF9sqdXhNxLHNN') > 0;
