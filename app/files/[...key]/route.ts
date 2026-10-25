import { getCloudflareContext } from '@opennextjs/cloudflare';

const TYPES: Record<string, string> = {
  pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  doc: 'application/msword', xls: 'application/vnd.ms-excel', ppt: 'application/vnd.ms-powerpoint',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

// Снимки и документи от R2 (връзката FILES): /files/novini/2026/snimka.jpg → ключ „novini/2026/snimka.jpg“.
export async function GET(req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const bucket = (env as CloudflareEnv).FILES;
  if (!bucket) return new Response('Няма хранилище', { status: 503 });

  const k = key.map(decodeURIComponent).join('/');
  const obj = await bucket.get(k, { onlyIf: req.headers, range: req.headers });
  if (!obj) return new Response('Не е намерено', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  // по-стари файлове понякога са записани без вид → браузърът ги тегли; оправяме вида по разширението,
  // за да се отварят направо (и в прегледа на документи)
  const ext = (k.match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase();
  const ct = headers.get('content-type') ?? '';
  if (TYPES[ext] && (!ct || ct === 'application/octet-stream' || ct === 'binary/octet-stream')) headers.set('content-type', TYPES[ext]);
  if (/^(pdf|jpe?g|png|gif|webp)$/.test(ext)) headers.set('content-disposition', 'inline');
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=86400');
  if (!('body' in obj)) return new Response(null, { status: 304, headers }); // не е променен
  return new Response(obj.body, { status: req.headers.has('range') && obj.range ? 206 : 200, headers });
}
