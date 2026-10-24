import { headers } from 'next/headers';
import { createRemoteJWKSet, jwtVerify } from 'jose';

// Вход в админ панела: Cloudflare Access пази пътя /admin* и пуска само училищните Google акаунти.
// Тук проверяваме подписа на токена от Access и кой е влязъл.
//   ACCESS_TEAM_DOMAIN = напр. souvalchidol.cloudflareaccess.com
//   ACCESS_AUD         = „Application Audience (AUD) Tag“ от приложението в Access
//   ADMIN_EMAILS       = по желание: изброени имейли, напр. „a@x.bg,b@x.bg“
//   ADMIN_DOMAIN       = по желание: целият домейн, напр. „souvalchidol.com“
// Локално (next dev) може DEV_ADMIN_EMAIL=някой@домейн вместо Access.

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function allowed(email: string): boolean {
  const e = email.toLowerCase();
  const list = (process.env.ADMIN_EMAILS || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  const domain = (process.env.ADMIN_DOMAIN || '').trim().toLowerCase();
  if (!list.length && !domain) return true; // правилата са само в Access
  return list.includes(e) || (!!domain && e.endsWith('@' + domain));
}

export async function getAdmin(): Promise<{ email: string } | null> {
  if (process.env.NODE_ENV === 'development' && process.env.DEV_ADMIN_EMAIL) return { email: process.env.DEV_ADMIN_EMAIL };

  const team = process.env.ACCESS_TEAM_DOMAIN;
  const aud = process.env.ACCESS_AUD;
  if (!team || !aud) return null;
  const token = (await headers()).get('cf-access-jwt-assertion');
  if (!token) return null;
  try {
    jwks ??= createRemoteJWKSet(new URL(`https://${team}/cdn-cgi/access/certs`));
    const { payload } = await jwtVerify(token, jwks, { issuer: `https://${team}`, audience: aud });
    const email = typeof payload.email === 'string' ? payload.email : '';
    return email && allowed(email) ? { email } : null;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<{ email: string }> {
  const a = await getAdmin();
  if (!a) throw new Error('Нямате достъп');
  return a;
}
