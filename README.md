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

## Първоначална настройка в Cloudflare (еднократно)

Акаунтът в Cloudflare да е на училищния Google Workspace.

```bash
npx wrangler login
npx wrangler d1 create souvalchidol            # сложи database_id в wrangler.jsonc
npx wrangler r2 bucket create souvalchidol-files
npm run db:migrate                              # схемата в облачната база
npx wrangler secret put GMAIL_CLIENT_ID          # и останалите от .env.example
npm run deploy
```

След това в Cloudflare: Workers → souvalchidol → Settings → Domains → добави `souvalchidol.com` и `www.souvalchidol.com`
(DNS-ът на домейна трябва да е в Cloudflare).

## Админ панел (/admin)

Служителите влизат на `souvalchidol.com/admin` и оттам пускат новини, документи, снимки и събития.
Входът е през **Cloudflare Access** с училищните Google акаунти (еднократна настройка):

1. Cloudflare → Zero Trust → Settings → Authentication → добави **Google Workspace** (или Google) като начин за вход.
2. Zero Trust → Access → Applications → *Self-hosted*: домейн `souvalchidol.com`, път `admin`.
   Правило: *Allow*, *Emails ending in* `@<домейна на училището>` (или изброени имейли).
3. От приложението копирай **Application Audience (AUD) Tag**, после:
   ```bash
   npx wrangler secret put ACCESS_TEAM_DOMAIN   # напр. souvalchidol.cloudflareaccess.com
   npx wrangler secret put ACCESS_AUD
   ```
   По желание и `ADMIN_DOMAIN` или `ADMIN_EMAILS` — втора проверка в самия сайт.

Локално: в `.dev.vars` сложи `DEV_ADMIN_EMAIL=ти@пример.bg` и пусни `npm run dev`.

## Къде какво е

- `lib/db.ts` — връзката с D1; `lib/data.ts` — всички заявки за новини, събития, галерия, документи, екип.
- `migrations/` — схемата на базата (нова промяна = нов файл `0002_...sql`).
- `app/files/[...key]` — отдава файлове от R2 на адрес `/files/...`.
- `app/admin/` — админ панелът; `lib/auth.ts` — проверка на входа; `lib/files.ts` — качване в R2.
