import { cookies } from 'next/headers';
import { first, db } from './db';

// Вход в админ панела с имейл и парола. Хората са в таблицата admin_users (миграция 0003).
// Ролята „admin“ добавя и маха хора; „editor“ само пише съдържание.
// Първият главен админ се създава от формата за вход с кода ADMIN_SETUP_CODE (тайна в GitHub).
// Локално (next dev) може DEV_ADMIN_EMAIL=някой@домейн без вход.

export type Admin = { email: string; name: string | null; role: 'admin' | 'editor' };

export const SESSION_COOKIE = 'adm_s';
export const SESSION_DAYS = 30;
const ITER = 100_000; // най-много, което Workers позволява за PBKDF2

const enc = new TextEncoder();
const b64 = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iter: number): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, key, 256);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITER}$${b64(salt)}$${b64(await pbkdf2(password, salt, ITER))}`;
}

export async function checkPassword(password: string, stored: string): Promise<boolean> {
  const [kind, iter, salt, hash] = stored.split('$');
  if (kind !== 'pbkdf2' || !iter || !salt || !hash) return false;
  const got = new Uint8Array(await pbkdf2(password, unb64(salt), Number(iter)));
  const want = unb64(hash);
  if (got.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ want[i];
  return diff === 0;
}

export async function sha256(s: string): Promise<string> {
  return b64(await crypto.subtle.digest('SHA-256', enc.encode(s)));
}

export function newToken(): string {
  return b64(crypto.getRandomValues(new Uint8Array(32))).replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' })[c]!);
}

export async function startSession(email: string): Promise<void> {
  const d = await db();
  if (!d) throw new Error('Няма връзка с базата');
  const token = newToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await d.batch([
    d.prepare(`DELETE FROM admin_sessions WHERE expires_at < ?`).bind(new Date().toISOString()),
    d.prepare(`INSERT INTO admin_sessions (token_hash, email, expires_at) VALUES (?, ?, ?)`).bind(await sha256(token), email, expires.toISOString()),
    d.prepare(`UPDATE admin_users SET failed = 0, locked_until = NULL, last_login = ? WHERE email = ?`).bind(new Date().toISOString(), email),
  ]);
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', expires });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const d = await db();
    await d?.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  }
  jar.delete(SESSION_COOKIE);
}

export async function getAdmin(): Promise<Admin | null> {
  if (process.env.NODE_ENV === 'development' && process.env.DEV_ADMIN_EMAIL) {
    return { email: process.env.DEV_ADMIN_EMAIL, name: null, role: 'admin' };
  }
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return first<Admin>(
    `SELECT u.email, u.name, u.role FROM admin_sessions s JOIN admin_users u ON u.email = s.email
     WHERE s.token_hash = ? AND s.expires_at > ?`,
    await sha256(token), new Date().toISOString(),
  );
}

export async function requireAdmin(): Promise<Admin> {
  const a = await getAdmin();
  if (!a) throw new Error('Нямате достъп');
  return a;
}

export async function requireMainAdmin(): Promise<Admin> {
  const a = await requireAdmin();
  if (a.role !== 'admin') throw new Error('Само главен админ може да прави това');
  return a;
}
