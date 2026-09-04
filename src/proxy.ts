import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MARKETS, DEFAULT_MARKET } from '@/config/markets';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Игнорируем Админку Payload CMS, API и статические файлы — пропускаем напрямую
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Логика определения страны, языка и валюты
  const response = NextResponse.next();
  const existingCountry = request.cookies.get('avita_country')?.value;

  if (!existingCountry) {
    const countryHeader =
      request.headers.get('x-vercel-ip-country') ||
      (request as any).geo?.country ||
      'RU';

    const upperCountry = countryHeader.toUpperCase();
    const targetMarket = MARKETS[upperCountry] || DEFAULT_MARKET;

    response.cookies.set('avita_country', targetMarket.code);
    response.cookies.set('avita_lang', targetMarket.language);
    response.cookies.set('avita_currency', targetMarket.currency);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|admin|_next/static|_next/image|favicon.ico|media).*)'],
};