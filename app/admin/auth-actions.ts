'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db, first } from '../../lib/db';
import { AREAS } from '../../lib/perms';
import { checkPassword, endSession, hashPassword, requireAdmin, requireMainAdmin, startSession } from '../../lib/auth';

export type FormState = { error?: string; ok?: string } | undefined;

const str = (f: FormData, k: string, max = 200) => String(f.get(k) ?? '').trim().slice(0, max);
const email = (f: FormData) => str(f, 'email').toLowerCase();
const MIN_PASS = 10;
const MAX_FAILS = 5;
const LOCK_MIN = 15;
const DUMMY = 'pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

async function D() {
  const d = await db();
  if (!d) throw new Error('Няма връзка с базата');
  return d;
}

function passProblem(p: string): string | undefined {
  if (p.length < MIN_PASS) return `Паролата трябва да е поне ${MIN_PASS} знака.`;
  if (p.length > 200) return 'Паролата е твърде дълга.';
}

export async function login(_: FormState, f: FormData): Promise<FormState> {
  const d = await D();
  const e = email(f);
  const pass = String(f.get('password') ?? '');
  const u = await first<{ email: string; pass_hash: string; failed: number; locked_until: string | null }>(
    'SELECT email, pass_hash, failed, locked_until FROM admin_users WHERE email = ?', e);
  const now = new Date();
  if (u?.locked_until && u.locked_until > now.toISOString()) {
    return { error: `Твърде много грешни опити. Опитайте пак след ${LOCK_MIN} минути.` };
  }
  const ok = await checkPassword(pass, u?.pass_hash ?? DUMMY);
  if (!u || !ok) {
    if (u) {
      const failed = u.failed + 1;
      const lock = failed >= MAX_FAILS ? new Date(now.getTime() + LOCK_MIN * 6e4).toISOString() : null;
      await d.prepare('UPDATE admin_users SET failed = ?, locked_until = ? WHERE email = ?').bind(lock ? 0 : failed, lock, e).run();
    }
    return { error: 'Грешен имейл или парола.' };
  }
  await startSession(u.email);
  redirect('/admin');
}

// Само докато няма нито един човек: създава първия главен админ с кода от тайната ADMIN_SETUP_CODE.
export async function setupFirstAdmin(_: FormState, f: FormData): Promise<FormState> {
  const d = await D();
  const n = (await first<{ n: number }>('SELECT COUNT(*) AS n FROM admin_users'))?.n ?? 0;
  if (n > 0) return { error: 'Вече има админ. Влезте с имейл и парола.' };
  const code = process.env.ADMIN_SETUP_CODE || '';
  if (!code) return { error: 'Не е зададен код ADMIN_SETUP_CODE (тайна в GitHub).' };
  if (str(f, 'code') !== code) return { error: 'Грешен код.' };
  const e = email(f);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return { error: 'Невалиден имейл.' };
  const pass = String(f.get('password') ?? '');
  const bad = passProblem(pass);
  if (bad) return { error: bad };
  await d.prepare(`INSERT INTO admin_users (email, name, pass_hash, role) VALUES (?, ?, ?, 'admin')`)
    .bind(e, str(f, 'name') || null, await hashPassword(pass)).run();
  await startSession(e);
  redirect('/admin');
}

export async function logout() {
  await endSession();
  redirect('/admin');
}

export async function changeOwnPassword(_: FormState, f: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const u = await first<{ pass_hash: string }>('SELECT pass_hash FROM admin_users WHERE email = ?', me.email);
  if (!u || !(await checkPassword(String(f.get('current') ?? ''), u.pass_hash))) return { error: 'Сегашната парола е грешна.' };
  const pass = String(f.get('password') ?? '');
  const bad = passProblem(pass);
  if (bad) return { error: bad };
  await (await D()).prepare('UPDATE admin_users SET pass_hash = ? WHERE email = ?').bind(await hashPassword(pass), me.email).run();
  return { ok: 'Паролата е сменена.' };
}

/* ---------- Хора (само главен админ) ---------- */
export async function addUser(_: FormState, f: FormData): Promise<FormState> {
  await requireMainAdmin();
  const d = await D();
  const e = email(f);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return { error: 'Невалиден имейл.' };
  const pass = String(f.get('password') ?? '');
  const bad = passProblem(pass);
  if (bad) return { error: bad };
  if (await first('SELECT 1 FROM admin_users WHERE email = ?', e)) return { error: 'Този имейл вече е добавен.' };
  const role = f.get('role') === 'admin' ? 'admin' : 'editor';
  await d.prepare('INSERT INTO admin_users (email, name, pass_hash, role, perms) VALUES (?, ?, ?, ?, ?)')
    .bind(e, str(f, 'name') || null, await hashPassword(pass), role, role === 'admin' ? null : permsFrom(f)).run();
  revalidatePath('/admin/hora');
  return { ok: `Добавен е ${e}. Кажете му паролата лично; може да я смени от „Моят профил“.` };
}

export async function resetPassword(_: FormState, f: FormData): Promise<FormState> {
  await requireMainAdmin();
  const d = await D();
  const e = email(f);
  const pass = String(f.get('password') ?? '');
  const bad = passProblem(pass);
  if (bad) return { error: bad };
  await d.batch([
    d.prepare('UPDATE admin_users SET pass_hash = ?, failed = 0, locked_until = NULL WHERE email = ?').bind(await hashPassword(pass), e),
    d.prepare('DELETE FROM admin_sessions WHERE email = ?').bind(e),
  ]);
  return { ok: `Новата парола на ${e} е записана.` };
}

export async function setRole(f: FormData) {
  const me = await requireMainAdmin();
  const e = email(f);
  if (e === me.email) throw new Error('Не можете да смените собствената си роля.');
  const role = f.get('role') === 'admin' ? 'admin' : 'editor';
  await (await D()).prepare('UPDATE admin_users SET role = ? WHERE email = ?').bind(role, e).run();
  revalidatePath('/admin/hora');
}

// отметките от формата → „novini,sabitiya“; всички отметнати = null (всичко, и бъдещите раздели)
function permsFrom(f: FormData): string | null {
  const got = AREAS.map((a) => a.key).filter((k) => f.getAll('perm').includes(k));
  return got.length === AREAS.length ? null : got.join(',');
}

export async function setPerms(f: FormData) {
  const me = await requireMainAdmin();
  const e = email(f);
  if (e === me.email) throw new Error('Не можете да смените собствените си права.');
  await (await D()).prepare('UPDATE admin_users SET perms = ? WHERE email = ?').bind(permsFrom(f), e).run();
  revalidatePath('/admin/hora');
}

export async function deleteUser(f: FormData) {
  const me = await requireMainAdmin();
  const e = email(f);
  if (e === me.email) throw new Error('Не можете да изтриете себе си.');
  const d = await D();
  await d.batch([
    d.prepare('DELETE FROM admin_sessions WHERE email = ?').bind(e),
    d.prepare('DELETE FROM admin_users WHERE email = ?').bind(e),
  ]);
  revalidatePath('/admin/hora');
}
