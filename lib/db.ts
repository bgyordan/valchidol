import { getCloudflareContext } from '@opennextjs/cloudflare';

// Базата на сайта е Cloudflare D1 (връзката DB във wrangler.jsonc).
// Без връзка (напр. при билд без Cloudflare) връща null и страниците показват празно, вместо да се чупят.
export async function db(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as CloudflareEnv).DB ?? null;
  } catch {
    return null;
  }
}

// Удобство: всички редове от заявка, или [] при грешка/липса на база.
export async function all<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T[]> {
  const d = await db();
  if (!d) return [];
  try {
    const { results } = await d.prepare(sql).bind(...params).all<T>();
    return results ?? [];
  } catch (e) {
    console.error('[db]', (e as Error).message);
    return [];
  }
}

export async function first<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T | null> {
  const d = await db();
  if (!d) return null;
  try {
    return (await d.prepare(sql).bind(...params).first<T>()) ?? null;
  } catch (e) {
    console.error('[db]', (e as Error).message);
    return null;
  }
}

export function json<T>(v: unknown, fallback: T): T {
  if (typeof v !== 'string') return fallback;
  try { return JSON.parse(v) as T; } catch { return fallback; }
}
