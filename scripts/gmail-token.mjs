// Еднократен скрипт: токен САМО за изпращане на писма (gmail.send) от eis@csop-varna.bg — за контактната форма на сайта.
// Няма достъп до Drive или до пощата за четене. Пуска се на сървъра от папката на сайта:
//   node scripts/gmail-token.mjs
// Ползва същия OAuth клиент като ЕИС (Client ID / secret от ~/eis-google.env).
// Преди това: в Google Cloud (проекта на ЕИС) → APIs & Services → Library → „Gmail API“ → Enable.
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { writeFileSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const REDIRECT = 'https://developers.google.com/oauthplayground';
const SCOPE = 'https://www.googleapis.com/auth/gmail.send';
const rl = readline.createInterface({ input, output });

const clientId = (await rl.question('\n1) Постави Client ID (GOOGLE_CLIENT_ID от ~/eis-google.env) и Enter:\n> ')).trim();
const clientSecret = (await rl.question('\n2) Постави Client secret (GOOGLE_CLIENT_SECRET) и Enter:\n> ')).trim();

const url =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    login_hint: 'eis@csop-varna.bg',
  });

console.log('\n3) Отвори този линк в ИНКОГНИТО прозорец, влез с eis@csop-varna.bg и натисни Allow:\n');
console.log(url);
console.log('\n   Ще излезе страница с грешка — това е нормално.');

const back = (await rl.question('\n4) Копирай ЦЕЛИЯ адрес от браузъра, постави го тук и Enter:\n> ')).trim();

let code = null;
try {
  const m = decodeURIComponent(decodeURIComponent(back)).match(/[?&]code=([^&]+)/);
  if (m) code = m[1];
} catch {}
if (!code) { console.error('\nНе намерих код в адреса. Пусни скрипта отначало.'); process.exit(1); }

const tok = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code, grant_type: 'authorization_code', redirect_uri: REDIRECT }),
}).then((r) => r.json());

if (!tok.refresh_token) {
  console.error('\nНе се получи refresh token. Отговор от Google:');
  console.error(JSON.stringify({ error: tok.error, description: tok.error_description }, null, 2));
  process.exit(1);
}

// пробно писмо до tech@
const to = (await rl.question('\n5) До кой адрес да отиват писмата от формата? (Enter = tech@csop-varna.bg)\n> ')).trim() || 'tech@csop-varna.bg';
rl.close();
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
const raw = Buffer.from([
  `From: =?UTF-8?B?${b64('Сайт ЦСОП Варна')}?= <eis@csop-varna.bg>`,
  `To: ${to}`,
  `Subject: =?UTF-8?B?${b64('Проба: контактната форма на сайта работи')}?=`,
  'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '',
  b64('Ако виждаш това писмо, сайтът може да праща от eis@csop-varna.bg.'),
].join('\r\n'), 'utf8').toString('base64url');
const sent = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
  method: 'POST', headers: { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ raw }),
});

const file = join(homedir(), 'site-gmail.env');
writeFileSync(file, `GMAIL_CLIENT_ID=${clientId}\nGMAIL_CLIENT_SECRET=${clientSecret}\nGMAIL_REFRESH_TOKEN=${tok.refresh_token}\nCONTACT_TO=${to}\n`);
chmodSync(file, 0o600);

console.log(`\nКлючовете са записани в ${file}`);
if (sent.ok) console.log(`Пробното писмо до ${to} е изпратено — провери пощата.`);
else console.log('Пробното писмо НЕ мина:', sent.status, (await sent.text()).slice(0, 300), '\n(провери дали Gmail API е включен в Google Cloud)');
console.log('\nСледва: добави редовете от файла в .env.local на сайта и рестартирай:');
console.log(`  cat ${file} >> .env.local && pm2 restart csop-web --update-env`);
