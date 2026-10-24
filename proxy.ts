import { NextResponse, type NextRequest } from 'next/server';

// Английската част (/en/...) получава заглавка x-lang: en —
// по нея основният layout слага <html lang="en"> и английските меню и долна част.
export function proxy(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set('x-lang', 'en');
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/en', '/en/:path*'] };
