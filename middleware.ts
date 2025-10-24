import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // Always redirect to the updating page regardless of the path
  const url = request.nextUrl.clone();
  url.pathname = '/updating';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};