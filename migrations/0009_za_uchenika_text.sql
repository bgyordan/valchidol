-- Подреден текст на страницата „За ученика“ (началната на раздел „Ученици“).
-- Сменя се САМО ако текстът още е старият, пренесен от Google Sites (започва със заповед РД 07-465) —
-- ако някой вече го е редактирал в админа, нищо не се пипа.
-- Махнато: обявата за неучебен ден 02.05.2024 (изтекла). Всичко останало е подредено в групи с пояснения.
UPDATE site_pages SET body = '## Изпити – ДЗИ и НВО

Държавните зрелостни изпити (ДЗИ) в XII клас и националното външно оценяване (НВО). Резултатите и анализите са в [Анализ от НВО и ДЗИ](/analiz-nvo-dzi).

- [Запознаване с оценените изпитни работи от ДЗИ – XII клас](https://drive.google.com/file/d/1V3aTwpGuywnE9tQshpwDO49eGwlPzhfM/view?usp=sharing)
- [Запознаване с оценените изпитни работи от НВО – IV клас](https://drive.google.com/file/d/1YZtnCAvP-Tp8T0yx5ai94kBLFOLA5nQv/view?usp=sharing)
- [Дати за ДЗИ за професионална квалификация – теория](https://drive.google.com/file/d/1rV0azZ1oCf-1vipwLQUVr5gGX3LXrjQU/view?usp=sharing)
- [Дати за ДЗИ за професионална квалификация – практика](https://drive.google.com/file/d/17d6mE-Gk30OJAGZsUF8n0DOmxefiRNm5/view?usp=sharing)
- [Дати за ДЗИ за професионална квалификация – график](https://drive.google.com/file/d/1MZb4fy3__5NajPk8NAKx5wYEojirZJNl/view?usp=drive_link)

## За абитуриентите

Какво трябва да знаят завършващите XII клас.

- [Здравноосигурителни задължения на абитуриентите](https://drive.google.com/file/d/1_NP_QYhxnJEOjwgUiC0ZpC_sOdHjee-7/view?usp=sharing)

## Заповеди и правила

Документи на директора и правила, които всеки ученик трябва да познава.

- [Заповед № РД 07-465 / 28.01.2025 г. на директора](https://drive.google.com/file/d/1Bh1o8kl2V8xrYzyhd7wKao4EyiVaG-Nh/view?usp=sharing)
- [Правила за оказване на първа помощ](https://drive.google.com/file/d/1vBsXb1Jr27OyrFrOm6AfV95pgbmJotdI/view?usp=sharing)

## Безопасен интернет

Как да пазим себе си и личните си данни онлайн.

- [Правила за безопасна работа в училищната мрежа и в интернет](https://drive.google.com/file/d/1UNnly_HDtMBNmbaqqeT9n2Bfcsa9I_eb/view?usp=sharing)
- [Сайт за безопасен интернет – направен от ученици от 10 а клас](https://sites.google.com/view/bezopaseninternet/начална-страница)
- [Национален център за безопасен интернет](https://www.safenet.bg/bg/)
- [Коалиция за медийна грамотност](https://gramoten.li/)

## При земетресение

Какво да правим и как да се държим по време на земетресение и след него.

- [Полезна информация и правила за поведение при земетресение](http://pojarna.com/земетресение/)
- [Правила за поведение при земетресение – ГДПБЗН към МВР](https://www.mvr.bg/gdpbzn/info-center/pravila-povedenie/pri-zemetresenie)

## Здраве и превенция

Информация за рисковете от наркотици и къде да потърсим помощ.

- [„Животът е безценен! Не го заменяй за дрога!“](https://drive.google.com/file/d/1WgDUNgKOT8C5O1KMT2SF9sqdXhNxLHNN/view?usp=sharing)
- [Рискове при употреба на наркотици – брошура на „От другата страна“](https://otdrugatastrana.org/broshura/)
- [Образователни ресурси и мобилни приложения – проект PREDICT](http://www.projectpredict.eu/oer-platform_bg.php)'
WHERE slug = 'za-uchenika' AND body LIKE '[Заповед РД 07 - 465/28.01.2025%';
