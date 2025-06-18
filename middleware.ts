import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'
// import { headers } from 'next/headers';

export default createMiddleware(routing);

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const headers = new Headers(request.headers);
//   headers.set("x-current-path", request.nextUrl.pathname);
//   return NextResponse.next({ headers });
// }

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};