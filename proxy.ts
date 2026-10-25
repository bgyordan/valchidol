import { NextResponse, type NextRequest } from 'next/server';

// Адресите под /en са английската версия: казваме на страниците езика чрез заглавката x-lang.
export function proxy(req: NextRequest) {
  const h = new Headers(req.headers);
  h.set('x-lang', 'en');
  return NextResponse.next({ request: { headers: h } });
}

export const config = { matcher: ['/en', '/en/:path*'] };
