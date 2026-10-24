import { getCloudflareContext } from '@opennextjs/cloudflare';

// Снимки и документи от R2 (връзката FILES): /files/novini/2026/snimka.jpg → ключ „novini/2026/snimka.jpg“.
export async function GET(req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const bucket = (env as CloudflareEnv).FILES;
  if (!bucket) return new Response('Няма хранилище', { status: 503 });

  const obj = await bucket.get(key.map(decodeURIComponent).join('/'), { onlyIf: req.headers, range: req.headers });
  if (!obj) return new Response('Не е намерено', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=86400');
  if (!('body' in obj)) return new Response(null, { status: 304, headers }); // не е променен
  return new Response(obj.body, { status: obj.range ? 206 : 200, headers });
}
