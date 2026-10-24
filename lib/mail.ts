// Изпращане на писма от сайта през Gmail API като eis@csop-varna.bg.
// Ключовете са в .env.local на сайта (виж scripts/gmail-token.mjs):
//   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN — токен САМО за изпращане (gmail.send), без достъп до Drive.
//   CONTACT_TO — до кого отиват писмата от формата (по подразбиране tech@csop-varna.bg).

let cached: { token: string; exp: number } | null = null;

export function mailConfigured() {
  return !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN);
}

async function accessToken() {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID!,
      client_secret: process.env.GMAIL_CLIENT_SECRET!,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });
  const j: any = await res.json();
  if (!j.access_token) {
    console.error('[mail] token', res.status, JSON.stringify(j).slice(0, 300));
    throw new Error('Gmail вход неуспешен');
  }
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return cached.token;
}

const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');
// заглавие на кирилица — RFC 2047
const header = (s: string) => `=?UTF-8?B?${b64(s)}?=`;
// без нови редове в заглавките (защита от вмъкване на допълнителни заглавки)
const clean = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

export async function sendMail(m: { to: string; subject: string; text: string; replyTo?: string; fromName?: string }) {
  const lines = [
    `From: ${header(m.fromName || 'Сайт ЦСОП Варна')} <eis@csop-varna.bg>`,
    `To: ${clean(m.to)}`,
    ...(m.replyTo ? [`Reply-To: ${clean(m.replyTo)}`] : []),
    `Subject: ${header(clean(m.subject))}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(m.text).replace(/.{76}/g, '$&\r\n'),
  ];
  const raw = Buffer.from(lines.join('\r\n'), 'utf8').toString('base64url');
  for (let attempt = 0; ; attempt++) {
    const token = await accessToken();
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
      cache: 'no-store',
    });
    if (res.ok) return;
    if (res.status === 401 && attempt === 0) { cached = null; continue; }
    const j: any = await res.json().catch(() => ({}));
    console.error('[mail] send', res.status, JSON.stringify(j?.error || {}).slice(0, 400));
    throw new Error('Писмото не беше изпратено');
  }
}
