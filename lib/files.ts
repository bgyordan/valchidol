import { getCloudflareContext } from '@opennextjs/cloudflare';

// Качване и триене на файлове в R2 (връзката FILES). Публичният адрес е /files/<ключ>.
const PREFIX = '/files/';

async function bucket(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  const b = (env as CloudflareEnv).FILES;
  if (!b) throw new Error('Няма хранилище за файлове (R2)');
  return b;
}

// Латиница за имената на файловете, за да са адресите четими.
const LAT: Record<string, string> = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sht',ъ:'a',ь:'y',ю:'yu',я:'ya' };
export function slugify(s: string): string {
  return s.toLowerCase().split('').map((c) => LAT[c] ?? c).join('')
    .replace(/[^a-z0-9.]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'fail';
}

export function isFile(v: FormDataEntryValue | null): v is File {
  return !!v && typeof v === 'object' && 'arrayBuffer' in v && (v as File).size > 0;
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  const dot = file.name.lastIndexOf('.');
  const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name);
  const ext = dot > 0 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  const key = `${folder}/${new Date().toISOString().slice(0, 7)}/${base}-${crypto.randomUUID().slice(0, 6)}${ext ? '.' + ext : ''}`;
  await (await bucket()).put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });
  return PREFIX + key;
}

// Трие само файлове от нашето хранилище; външни адреси се пропускат.
export async function deleteFile(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith(PREFIX)) return;
  try { await (await bucket()).delete(url.slice(PREFIX.length)); } catch { /* вече го няма */ }
}
