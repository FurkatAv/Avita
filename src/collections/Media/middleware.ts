import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['tr', 'uz', 'pl', 'de', 'ru'] as const;
const DEFAULT_LOCALE = 'ru';

// Матрица соответствия стран (IP Vercel) языку и валюте
const COUNTRY_SETTINGS: Record<string, { lang: string; currency: string }> = {
  TR: { lang: 'tr', currency: 'TRY' },
  UZ: { lang: 'uz', currency: 'UZS' },
  RU: { lang: 'ru', currency: 'RUB' },
  PL: { lang: 'pl', currency: 'PLN' },
  DE: { lang: 'de', currency: 'EUR' },
  AT: { lang: 'de', currency: 'EUR' },
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Исключаем системные пути, API, админку Payload и статику
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Проверяем, содержится ли уже языковой префикс в URL (например, /tr/catalog)
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const savedLang = request.cookies.get('avita_lang')?.value;
  const savedCurrency = request.cookies.get('avita_currency')?.value;

  // Определяем страну через заголовок Vercel (дефолт для неизвестных стран: RU и USD)
  const countryHeader = request.headers.get('x-vercel-ip-country') || 'RU';
  const targetSettings = COUNTRY_SETTINGS[countryHeader] || { lang: 'ru', currency: 'USD' };

  const targetLang = savedLang || targetSettings.lang;
  const targetCurrency = savedCurrency || targetSettings.currency;

  const response = NextResponse.next();

  // Записываем параметры в куки на 1 год при их отсутствии
  if (!savedLang) {
    response.cookies.set({
      name: 'avita_lang',
      value: targetLang,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  if (!savedCurrency) {
    response.cookies.set({
      name: 'avita_currency',
      value: targetCurrency,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  // Если в пути нет языкового префикса, перенаправляем на актуальный локализованный путь
  if (!pathnameHasLocale) {
    const localeToUse = LOCALES.includes(targetLang as any) ? targetLang : DEFAULT_LOCALE;
    return NextResponse.redirect(
      new URL(`/${localeToUse}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Исключает все пути, которые не требуют проверки гео-мидлваром
     */
    '/((?!api|_next/static|_next/image|admin|favicon.ico).*)',
  ],
};