// Обвивка около сайта (OpenNext), за да харчи по-малко изчисления на заявка:
//  1) /files/... (снимки и документи от R2) се дават направо, без да се пуска Next.js;
//  2) готовите публични страници се пазят 5 минути в кеша на Cloudflare (промените от админа се виждат до 5 мин по-късно).
// (файлът се създава при билда — opennextjs-cloudflare build; worker.ts не се проверява от tsc)
import next from './.open-next/worker.js';
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js';

const PAGE_TTL = 300; // секунди

const TYPES: Record<string, string> = {
  pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  doc: 'application/msword', xls: 'application/vnd.ms-excel', ppt: 'application/vnd.ms-powerpoint',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

type Env = { FILES?: R2Bucket } & Record<string, unknown>;

async function serveFile(req: Request, url: URL, env: Env): Promise<Response> {
  const bucket = env.FILES;
  if (!bucket) return new Response('Няма хранилище', { status: 503 });
  let k: string;
  try {
    k = url.pathname.slice('/files/'.length).split('/').map(decodeURIComponent).join('/');
  } catch {
    return new Response('Не е намерено', { status: 404 });
  }
  const obj = await bucket.get(k, { onlyIf: req.headers, range: req.headers });
  if (!obj) return new Response('Не е намерено', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  // по-стари файлове понякога са записани без вид → оправяме го по разширението, за да се отварят направо
  const ext = (k.match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase();
  const ct = headers.get('content-type') ?? '';
  if (TYPES[ext] && (!ct || ct === 'application/octet-stream' || ct === 'binary/octet-stream')) headers.set('content-type', TYPES[ext]);
  if (/^(pdf|jpe?g|png|gif|webp)$/.test(ext)) headers.set('content-disposition', 'inline');
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=86400');
  if (!('body' in obj)) return new Response(null, { status: 304, headers }); // не е променен
  return new Response(obj.body, { status: req.headers.has('range') && obj.range ? 206 : 200, headers });
}

// Страници, които не се кешират: админ, API, вход, и всичко, когато админът е влязъл.
function cacheable(req: Request, url: URL): boolean {
  if (req.method !== 'GET') return false;
  const p = url.pathname;
  if (p.startsWith('/admin') || p.startsWith('/api') || p.startsWith('/_next') || p.startsWith('/cdn-cgi')) return false;
  if ((req.headers.get('cookie') ?? '').includes('adm_s=')) return false;
  return true;
}

// Next.js дава различен отговор според тези заглавки (обикновена страница или данни при преход между страници).
const VARY = ['rsc', 'next-router-state-tree', 'next-router-prefetch', 'next-router-segment-prefetch', 'next-url'];

async function cacheKey(req: Request, url: URL): Promise<Request> {
  const parts = VARY.map((h) => req.headers.get(h) ?? '').join('|');
  const k = new URL(url);
  if (parts.replace(/\|/g, '')) {
    const d = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(parts));
    k.searchParams.set('__v', [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join(''));
  }
  return new Request(k.toString(), { method: 'GET' });
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    if ((req.method === 'GET' || req.method === 'HEAD') && url.pathname.startsWith('/files/')) return serveFile(req, url, env);
    if (!cacheable(req, url)) return next.fetch(req, env, ctx);

    const cache = (caches as unknown as { default: Cache }).default;
    const key = await cacheKey(req, url);
    const hit = await cache.match(key);
    if (hit) return hit;

    const res: Response = await next.fetch(req, env, ctx);
    if (res.status === 200 && !res.headers.has('set-cookie')) {
      const copy = new Response(res.clone().body, res);
      copy.headers.set('cache-control', `public, max-age=${PAGE_TTL}`);
      ctx.waitUntil(cache.put(key, copy).catch(() => {}));
    }
    return res;
  },
};
