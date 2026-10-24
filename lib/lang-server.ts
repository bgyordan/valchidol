import { headers } from 'next/headers';
import type { Lang } from './lang';

// Езикът на текущата заявка — задава се от proxy.ts за адресите под /en
export async function getLang(): Promise<Lang> {
  return (await headers()).get('x-lang') === 'en' ? 'en' : 'bg';
}
