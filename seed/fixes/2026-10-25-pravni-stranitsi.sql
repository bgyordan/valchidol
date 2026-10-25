-- „Достъп до информация“, „Административни услуги“ и „Лични данни“: документите в групи с ясни имена и нов текст на страниците.
-- Може да се пуска повече от веднъж.

-- Административни услуги: описание на услугата и след него заявлението ѝ
UPDATE site_documents SET category = 'Прием и преместване', sort_order = 10 WHERE section = 'administrativni-uslugi' AND (name = 'Преместване на ученици в държавните и в общинските училища' OR name = 'Преместване на ученици в държавните и в общинските училища.');
UPDATE site_documents SET category = 'Прием и преместване', sort_order = 20 WHERE section = 'administrativni-uslugi' AND (name = 'Приемане на деца в първи клас в държавните и в общинските училища' OR name = 'Приемане на деца в първи клас в държавните и в общинските училища.');
UPDATE site_documents SET category = 'Прием и преместване', sort_order = 30 WHERE section = 'administrativni-uslugi' AND (name = 'Приемане на ученици в V клас по училищен прием в неспециализираните училища' OR name = 'Приемане на ученици в V клас по училищен прием в неспециализираните училища.');
UPDATE site_documents SET category = 'Прием и преместване', sort_order = 40 WHERE section = 'administrativni-uslugi' AND (name = 'Приемане на ученици в V клас в профилираните гимназии с профил Математически или Природни науки на места определени по държавен план-прием' OR name = 'Приемане на ученици в V клас в профилираните гимназии с профил Математически или Природни науки на места определени по държавен план-прием.');
UPDATE site_documents SET category = 'Прием и преместване', sort_order = 50 WHERE section = 'administrativni-uslugi' AND (name = 'Приемане на ученици в VIII клас в непрофилираните училища – профилирани и професионални гимназии, обединени и средни училища на места определени по държавен план-прием' OR name = 'Приемане на ученици в VIII клас в непрофилираните училища – профилирани и професионални гимназии, обединени и средни училища на места определени по държавен план-прием.');
UPDATE site_documents SET category = 'Прием и преместване', sort_order = 60 WHERE section = 'administrativni-uslugi' AND (name = 'Приемане на ученици, завършили първия гимназиален етап на средно образование от обединените училища в XI клас в непрофилираните училища – профилирани и професионални гимназии и средни училища на места определени по допълнителния държавен план-прием' OR name = 'Приемане на ученици, завършили първия гимназиален етап на средно образование от обединените училища в XI клас в непрофилираните училища – профилирани и професионални гимназии и средни училища на места определени по допълнителния държавен план-прием.');
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 110, name = 'Издаване на диплома за средно образование' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/d942a217f813f085.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 120, name = 'Издаване на дубликат на документ за завършен клас, етап или степен на образование – удостоверения, свидетелства, дипломи' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/5a3d09d0475c8411.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 121, name = 'Заявление за издаване на дубликат' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/b0b1ea8b687c95c0.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 130, name = 'Издаване на удостоверения за професионално обучение и свидетелства за професионална квалификация' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/a77fb618dd81af65.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 140, name = 'Издаване на удостоверения за валидиране на професионална квалификация по част от професия и свидетелства за валидиране на професионална квалификация' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/e1eba3270beaec3d.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 150, name = 'Издаване на европейско приложение към свидетелство за професионална квалификация' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/3a5699673211d691.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 151, name = 'Заявление за европейско приложение към свидетелство за професионална квалификация' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/43b30841005658cd.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 160, name = 'Издаване на удостоверение за завършено задължително предучилищно образование' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/0a41de1e7fc22fa4.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 170, name = 'Издаване на удостоверение за валидиране на компетентности за завършен клас, етап или основна степен на образование' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/997f2cc0e68dca5e.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 171, name = 'Заявление за валидиране на компетентности' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/4a5c6d25f5956a9a.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 180, name = 'Издаване на европейско приложение към дипломата за средно образование' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/047ebce2056bd3f3.pdf';
UPDATE site_documents SET category = 'Дипломи, свидетелства и удостоверения', sort_order = 181, name = 'Заявление за европейско приложение към дипломата' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/2a1109c19352983d.pdf';
UPDATE site_documents SET category = 'Изпити и признаване', sort_order = 210, name = 'Издаване на служебна бележка за подадено заявление за допускане до държавни зрелостни изпити' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/ddb86ca465f4b42f.pdf';
UPDATE site_documents SET category = 'Изпити и признаване', sort_order = 220, name = 'Издаване на служебна бележка за допускане до държавни зрелостни изпити' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/65e301b33c414c7a.pdf';
UPDATE site_documents SET category = 'Изпити и признаване', sort_order = 230, name = 'Издаване на служебна бележка за резултатите от изпитите за проверка на способностите' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/5133ec84698272a1.pdf';
UPDATE site_documents SET category = 'Изпити и признаване', sort_order = 240, name = 'Признаване на завършен период или клас от I до VI клас в училище на чужда държава' WHERE section = 'administrativni-uslugi' AND file_url = '/files/dokumenti/stari/fd42713e4a845a11.pdf';

-- Достъп до обществена информация
UPDATE site_documents SET category = 'Закон и правила', sort_order = 10, name = 'Закон за достъп до обществена информация' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/531690b2e7189fc4.pdf';
UPDATE site_documents SET category = 'Закон и правила', sort_order = 20, name = 'Правила за достъп до обществена информация в СУ „Васил Левски“' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/f8a58279b48780e7.pdf';
UPDATE site_documents SET category = 'Образци', sort_order = 30, name = 'Заявление за достъп до обществена информация' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/765ab9b7fd642e4f.pdf';
UPDATE site_documents SET category = 'Образци', sort_order = 40, name = 'Протокол за приемане на устно заявление' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/4369f333ff1da567.pdf';
UPDATE site_documents SET category = 'Образци', sort_order = 50, name = 'Протокол за разглеждане на заявление' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/cd2a51f3aeafcb05.pdf';
UPDATE site_documents SET category = 'Годишни отчети', sort_order = 60, name = 'Отчет за 2025 г.' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/911ed091b3db817e.pdf';
UPDATE site_documents SET category = 'Годишни отчети', sort_order = 70, name = 'Отчет за 2024 г.' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/5f77819f65b839de.pdf';
UPDATE site_documents SET category = 'Годишни отчети', sort_order = 80, name = 'Отчет за 2023 г.' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/c545912bddc334c3.pdf';
UPDATE site_documents SET category = 'Годишни отчети', sort_order = 90, name = 'Отчет за 2022 г.' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/df23b295bfa6b582.pdf';
UPDATE site_documents SET category = 'Годишни отчети', sort_order = 100, name = 'Отчет за 2021 г.' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/30ed82f0658e9ed1.pdf';
UPDATE site_documents SET category = 'Годишни отчети', sort_order = 110, name = 'Отчет за 2020 г.' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/ddf4a96a38934d98.pdf';
UPDATE site_documents SET category = 'Годишни отчети', sort_order = 120, name = 'Отчет за 2019 г.' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/24a347e33c05fce8.pdf';
UPDATE site_documents SET category = 'Годишни отчети', sort_order = 130, name = 'Отчет за 2018 г.' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/3a6353bff3a0f00c.pdf';
UPDATE site_documents SET category = 'Годишни отчети', sort_order = 140, name = 'Отчет за 2017 г.' WHERE section = 'dostap-do-informatsiya' AND file_url = '/files/dokumenti/stari/5bc56e515099e6eb.pdf';

-- Лични данни
UPDATE site_documents SET category = 'Политика и правила', sort_order = 10, name = 'Политика за защита на личните данни' WHERE section = 'lichni-danni' AND file_url = '/files/dokumenti/stari/3abb8d45a0f35663.pdf';
UPDATE site_documents SET category = 'Политика и правила', sort_order = 20, name = 'Правила за защита на личните данни' WHERE section = 'lichni-danni' AND file_url = '/files/dokumenti/stari/02a101d32c571fc3.pdf';
UPDATE site_documents SET category = 'Политика и правила', sort_order = 30, name = 'Правилник за обработка на лични данни' WHERE section = 'lichni-danni' AND file_url = '/files/dokumenti/stari/44d6f3241de34600.pdf';
UPDATE site_documents SET category = 'Политика и правила', sort_order = 40, name = 'План за действие на Комисията за защита на личните данни' WHERE section = 'lichni-danni' AND file_url = '/files/dokumenti/stari/2702c0a8d61ed380.pdf';
UPDATE site_documents SET category = 'Информация за лицата', sort_order = 50, name = 'Информация за поверителност' WHERE section = 'lichni-danni' AND file_url = '/files/dokumenti/stari/e430565f8bb03a57.pdf';
UPDATE site_documents SET category = 'Информация за лицата', sort_order = 60, name = 'Информация за служителите' WHERE section = 'lichni-danni' AND file_url = '/files/dokumenti/stari/3dc739bc88b56a4a.pdf';

-- Текстовете на страниците
UPDATE site_pages SET body = 'Тук са описанията на административните услуги, които училището предоставя, и образците на заявленията към тях — съгласно чл. 28 от Административнопроцесуалния кодекс и чл. 16 от Наредбата за административното обслужване.

### Как се подава заявление

- в деловодството на училището, всеки работен ден от 8:00 до 17:00 ч., гр. Вълчи дол 9280, ул. „Георги Димитров“ № 1;
- по имейл: [info-400112@edu.mon.bg](mailto:info-400112@edu.mon.bg).

За повечето услуги заявлението се подава по образец, приложен към описанието на услугата. Ако за дадена услуга няма образец, заявлението се подава свободен текст или се попълва на място в деловодството.' WHERE slug = 'administrativni-uslugi';
UPDATE site_pages SET body = 'Всеки гражданин и всяко юридическо лице има право на достъп до обществената информация, която училището създава и съхранява, по реда на Закона за достъп до обществена информация (ЗДОИ).

### Как се подава заявление

- писмено — в деловодството, всеки работен ден от 8:00 до 17:00 ч., гр. Вълчи дол 9280, ул. „Георги Димитров“ № 1;
- по имейл — [info-400112@edu.mon.bg](mailto:info-400112@edu.mon.bg);
- устно — в деловодството, като за него се съставя протокол.

Заявлението съдържа имената на заявителя (или наименованието на организацията), описание на исканата информация, предпочитаната форма на достъп и адрес за кореспонденция. Решението се взема в срок до 14 дни. Достъпът е безплатен — при предоставяне на копия се заплащат само разходите по нормативите на министъра на финансите.

### Лице за контакт

Заместник-директор по административно-стопанската дейност — тел. [0892 412 342](tel:+359892412342), [l_petkova@abv.bg](mailto:l_petkova@abv.bg).' WHERE slug = 'dostap-do-informatsiya';
UPDATE site_pages SET body = 'СУ „Васил Левски“ – гр. Вълчи дол обработва лични данни законосъобразно, добросъвестно и прозрачно, съгласно Регламент (ЕС) 2016/679 (Общ регламент относно защитата на данните) и Закона за защита на личните данни. Тук е накратко как и защо го прави.

### Администратор на лични данни

Средно училище „Васил Левски“, гр. Вълчи дол 9280, ул. „Георги Димитров“ № 1, имейл [info-400112@edu.mon.bg](mailto:info-400112@edu.mon.bg).

### Длъжностно лице по защита на данните

Тел. [0892 412 342](tel:+359892412342), имейл [l_petkova@abv.bg](mailto:l_petkova@abv.bg), служебен адрес: гр. Вълчи дол 9280, ул. „Георги Димитров“ № 1. Към него можете да се обърнете с всеки въпрос за личните си данни.

### Чии данни обработваме

- ученици и деца в подготвителни групи;
- родители, настойници и други близки на учениците;
- служители и кандидати за работа;
- изпълнители по договори и посетители;
- лица, които подават заявления, сигнали или запитвания.

### Какви данни

Имена, ЕГН или ЛНЧ, дата и място на раждане, адрес и данни за контакт, данни от документ за самоличност, данни за образованието и успеха, данни за здравето — само когато са нужни по закон (например медицински бележки, специални образователни потребности), данни за трудовото и осигурителното правоотношение, както и снимки и видео от училищни прояви.

### За какво и на какво основание

- образование и обучение, водене на училищната документация и на информационната система на МОН (НЕИСПУО) — изпълнение на законово задължение по Закона за предучилищното и училищното образование;
- трудови и осигурителни отношения със служителите — законово задължение и договор;
- административни услуги, заявления по ЗДОИ и сигнали — законово задължение;
- пропускателен режим и сигурност на учениците и сградата — легитимен интерес;
- снимки и видео на ученици на сайта и в социалните мрежи — съгласие на родителя или ученика, което може да бъде оттеглено по всяко време.

### На кого се предават

Само на институции, когато законът го изисква — МОН, РУО – Варна, НАП, НОИ, общината, здравните и социалните органи, съдилищата — и на обработващи, които работят по поръчка на училището (например доставчици на електронен дневник и счетоводни услуги). Данните не се предават извън Европейския съюз.

### Колко дълго се пазят

В сроковете по Наредба № 8 за информацията и документите в системата на предучилищното и училищното образование, Закона за счетоводството, Кодекса на труда и другите нормативни актове. Данните, обработвани със съгласие, се пазят до оттеглянето му.

### Вашите права

- достъп до личните ви данни и копие от тях;
- коригиране на неточни данни;
- изтриване, когато няма законово основание данните да се пазят;
- ограничаване на обработването;
- възражение срещу обработване на основание легитимен интерес;
- преносимост на данните;
- оттегляне на съгласие, без това да засяга обработването дотогава.

Правата се упражняват с писмено заявление до училището или до длъжностното лице по защита на данните. Отговор се дава в срок до един месец.

### Жалба

Ако смятате, че правата ви са нарушени, можете да подадете жалба до Комисията за защита на личните данни, гр. София 1592, бул. „Проф. Цветан Лазаров“ № 2, [www.cpdp.bg](https://www.cpdp.bg/).

### Този сайт

- формата за контакт изпраща името, имейла, телефона и съобщението ви до училището, само за да ви отговорим;
- въпросите към „Помощник“ не се свързват с вас и не се пазят — моля, не пишете в тях лични данни;
- сайтът не използва рекламни или проследяващи бисквитки — подробности в [Политиката за бисквитките](/politika-za-biskvitki).

Полезни съвети за защита на личните данни в интернет има на [сайта на КЗЛД](https://www.cpdp.bg/?p=pages&aid=65).' WHERE slug = 'lichni-danni';
UPDATE site_pages SET title = 'Защита на личните данни' WHERE slug = 'lichni-danni';
