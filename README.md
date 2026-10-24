# Сайт на СУ Вълчи дол — souvalchidol.com

Next.js, който работи на **Cloudflare Workers** (чрез OpenNext). Базата е **D1**, снимките и документите са в **R2**.
Основата е кодът на сайта на ЦСОП Варна; съдържанието тепърва се сменя със съдържанието на училището.

## Локално

```bash
npm install
npm run db:migrate:local   # създава локалната база по migrations/
npm run dev                # http://localhost:3000 (вижда D1/R2 от wrangler.jsonc)
npm run preview            # пълна проверка в истинския Workers runtime
```

## Пускане в Cloudflare (автоматично през GitHub)

Всяка промяна в `main` се пуска сама от `.github/workflows/deploy.yml`. Той сам създава базата D1 и хранилището R2,
пуска миграциите, зарежда страниците от стария сайт (само ако базата е празна) и качва сайта.
Акаунтът в Cloudflare да е на училищния Google Workspace.

Еднократно:

1. Cloudflare → **Workers & Pages** → отвори веднъж, за да се избере адрес `*.workers.dev`.
2. Cloudflare → профил → **API Tokens** → *Create Token* → шаблон **Edit Cloudflare Workers** →
   добави ред *Account → D1 → Edit* → *Create*. Копирай токена.
3. GitHub → repo → **Settings → Secrets and variables → Actions** → *New repository secret*:
   `CLOUDFLARE_API_TOKEN` (токенът) и `CLOUDFLARE_ACCOUNT_ID` (Account ID от началната страница на Cloudflare).
4. GitHub → **Actions → Deploy → Run workflow**. Сайтът излиза на `https://souvalchidol.<адрес>.workers.dev`.

Тайните на сайта (Gmail, ADMIN_SETUP_CODE и т.н. от `.env.example`) се слагат пак като GitHub secrets със същите имена —
при следващото пускане се прехвърлят сами в Cloudflare. Страниците от стария сайт се зареждат наново само ръчно:
*Run workflow* с отметка „Зареди наново…“ (това изтрива промените по тях от админа).

### Собствен домейн (когато DNS-ът е в Cloudflare)

1. Cloudflare → *Add a domain* → `souvalchidol.com` → Free план. Cloudflare показва два nameserver-а.
2. При регистратора на домейна смени nameserver-ите с тези два (преди това провери, че в Cloudflare са пренесени
   всички записи, особено **MX** за пощата на Google — иначе пощата спира).
3. Когато домейнът стане *Active*: Workers & Pages → souvalchidol → Settings → **Domains & Routes** → *Add* →
   *Custom domain* → `souvalchidol.com`, после още веднъж за `www.souvalchidol.com`.

## Админ панел (/admin)

Служителите влизат на `/admin` с имейл и парола (таблица `admin_users`, миграция `0003`).
**Главният админ** добавя и маха хора от *Хора*; **редакторите** пишат съдържание. Паролите се пазят само като PBKDF2 хеш;
след 5 грешни опита входът за този имейл спира за 15 минути.

Първи вход (еднократно):

1. GitHub → Settings → Secrets → Actions → нов секрет `ADMIN_SETUP_CODE` (дълга фраза по избор) → *Run workflow*.
2. Отвори `/admin` → „Първоначална настройка“ → въведи кода, своя имейл и парола. Това става само докато няма никой.
3. После добави останалите от *Хора*. Кодът може да се изтрие от GitHub.

Локално: в `.dev.vars` сложи `DEV_ADMIN_EMAIL=ти@пример.bg` и пусни `npm run dev`.

## Къде какво е

- `lib/db.ts` — връзката с D1; `lib/data.ts` — всички заявки за новини, събития, галерия, документи, екип.
- `migrations/` — схемата на базата (нова промяна = нов файл `0002_...sql`).
- `app/files/[...key]` — отдава файлове от R2 на адрес `/files/...`.
- `app/admin/` — админ панелът; `lib/auth.ts` — проверка на входа; `lib/files.ts` — качване в R2.
