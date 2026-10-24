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

Тайните на сайта (Gmail, Access и т.н. от `.env.example`) се слагат пак като GitHub secrets със същите имена —
при следващото пускане се прехвърлят сами в Cloudflare. Страниците от стария сайт се зареждат наново само ръчно:
*Run workflow* с отметка „Зареди наново…“ (това изтрива промените по тях от админа).

### Собствен домейн (когато DNS-ът е в Cloudflare)

1. Cloudflare → *Add a domain* → `souvalchidol.com` → Free план. Cloudflare показва два nameserver-а.
2. При регистратора на домейна смени nameserver-ите с тези два (преди това провери, че в Cloudflare са пренесени
   всички записи, особено **MX** за пощата на Google — иначе пощата спира).
3. Когато домейнът стане *Active*: Workers & Pages → souvalchidol → Settings → **Domains & Routes** → *Add* →
   *Custom domain* → `souvalchidol.com`, после още веднъж за `www.souvalchidol.com`.
4. Преправи Access (по-долу) да пази само `souvalchidol.com/admin`, а не целия сайт.

## Админ панел (/admin)

Служителите влизат на `souvalchidol.com/admin` и оттам пускат новини, документи, снимки и събития.
Входът е през **Cloudflare Access** (еднократна настройка):

**Докато сайтът е само на workers.dev** (тестов период) Access пази целия адрес — така и непубликуваният сайт не е видим за всички:

1. Workers & Pages → souvalchidol → Settings → Domains & Routes → `workers.dev` → **Enable Cloudflare Access**
   (първия път Cloudflare иска да се избере име на екипа и безплатния план Zero Trust).
2. *Manage Cloudflare Access* → в правилото (policy) остави *Allow* и сложи *Emails ending in* `@<домейна на училището>`.
   Вход с еднократен код по имейл работи веднага; Google вход се добавя по-късно в Zero Trust → Settings → Authentication.
3. Копирай **Application Audience (AUD) Tag** и името на екипа и ги сложи като GitHub secrets
   `ACCESS_AUD` и `ACCESS_TEAM_DOMAIN` (напр. `souvalchidol.cloudflareaccess.com`), после *Run workflow*.

**След домейна**: Zero Trust → Access → Applications → *Self-hosted*: домейн `souvalchidol.com`, път `admin`,
същото правило; новия AUD Tag в `ACCESS_AUD`. Защитата на workers.dev може да се изключи.

По желание `ADMIN_DOMAIN` или `ADMIN_EMAILS` — втора проверка в самия сайт.

Локално: в `.dev.vars` сложи `DEV_ADMIN_EMAIL=ти@пример.bg` и пусни `npm run dev`.

## Къде какво е

- `lib/db.ts` — връзката с D1; `lib/data.ts` — всички заявки за новини, събития, галерия, документи, екип.
- `migrations/` — схемата на базата (нова промяна = нов файл `0002_...sql`).
- `app/files/[...key]` — отдава файлове от R2 на адрес `/files/...`.
- `app/admin/` — админ панелът; `lib/auth.ts` — проверка на входа; `lib/files.ts` — качване в R2.
