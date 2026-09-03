// middleware.ts (в корне проекта avita/)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MARKETS, DEFAULT_MARKET } from './config/markets';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Если пользователь уже выбирал язык/валюту вручную, куки имеют приоритет
  const existingCountry = request.cookies.get('avita_country')?.value;

  if (!existingCountry) {
    // Определяем страну по системным заголовкам хостинга (Vercel / Cloudflare) или геолокации Edge
    const countryHeader = 
      request.headers.get('x-vercel-ip-country') || 
      (request as any).geo?.country || 
      'RU';

    const upperCountry = countryHeader.toUpperCase();
    const targetMarket = MARKETS[upperCountry] || DEFAULT_MARKET;

    // Устанавливаем куки автоматически на первый визит
    response.cookies.set('avita_country', targetMarket.code);
    response.cookies.set('avita_lang', targetMarket.language);
    response.cookies.set('avita_currency', targetMarket.currency);
  }

  return response;
}

// Применяем middleware ко всем страницам, кроме статики и API
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};