// src/components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UI_TRANSLATIONS, Language } from '@/data/translations';
import { MarketSwitcher } from './MarketSwitcher';

export interface HeaderProps {
  lang?: Language | string;
  currency?: string;
  onLangChange?: (newLang: Language) => void;
  onCurrencyChange?: (newCurrency: string) => void;
}

export default function Header({
  lang = 'ru',
  currency = 'USD',
  onLangChange,
  onCurrencyChange,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeLang: Language = (['ru', 'en', 'tr', 'uz', 'de'].includes(lang) ? lang : 'ru') as Language;
  const tUI = UI_TRANSLATIONS[activeLang] || UI_TRANSLATIONS.ru;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#CBE0D4] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Логотип */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black text-[#2A4736] font-montserrat tracking-tight group-hover:text-[#376C4A] transition-colors">
                AVITA <span className="text-[#D4AF37]">GOLD</span>
              </span>
            </Link>
          </div>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#2A4736]">
            <Link href="/" className="hover:text-[#376C4A] transition-colors">
              Главная
            </Link>
            <Link href="/catalog" className="hover:text-[#376C4A] transition-colors">
              Каталог
            </Link>
            <Link href="/about" className="hover:text-[#376C4A] transition-colors">
              О нас
            </Link>
            <Link href="/contact" className="hover:text-[#376C4A] transition-colors">
              Контакты
            </Link>
          </nav>

          {/* Переключатель рынка/языка + Мобильная кнопка */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <MarketSwitcher
                lang={activeLang}
                currency={currency}
                onLangChange={onLangChange}
                onCurrencyChange={onCurrencyChange}
              />
            </div>

            {/* Кнопка гамбургер для мобилок */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-[#2A4736] hover:bg-[#EEF4F0] focus:outline-none transition-colors"
              aria-label="Переключить меню"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Выпадающее мобильное меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#CBE0D4] bg-white px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-2 font-medium text-base text-[#2A4736]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EEF4F0] transition-colors"
            >
              Главная
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EEF4F0] transition-colors"
            >
              Каталог
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EEF4F0] transition-colors"
            >
              О нас
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EEF4F0] transition-colors"
            >
              Контакты
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#CBE0D4] flex flex-col items-start gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Выбор страны / валюты
            </span>
            <MarketSwitcher
              lang={activeLang}
              currency={currency}
              onLangChange={onLangChange}
              onCurrencyChange={onCurrencyChange}
            />
          </div>
        </div>
      )}
    </header>
  );
}