// app/page.tsx
'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { useState } from 'react';
import Image from 'next/image';
import HeroProductSlider from '@/components/HeroProductSlider';
import { PRODUCTS, tText, tList } from '@/data/products';
import { UI_TRANSLATIONS, Language } from '@/data/translations';

export default function HomePage() {
  const { currency, setCurrency, formatPrice } = useCurrency() as any;
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ru');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartCount, setCartCount] = useState<number>(0);

  const tUI = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.ru;

  const languages: { code: Language; label: string }[] = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'tr', label: 'TR' },
    { code: 'uz', label: 'UZ' },
    { code: 'de', label: 'DE' },
  ];

  const currencies = ['RUB', 'UZS', 'TRY', 'EUR', 'PLN'];

  // Категории для фикс-панели под шапкой
  const categories = [
    { id: 'all', label: tUI.allCategories },
    { id: 'collagen', label: tUI.catCollagen },
    { id: 'complexes', label: tUI.catComplexes },
    { id: 'vitamins', label: tUI.catVitamins },
    { id: 'amino', label: tUI.catAmino },
  ];

  // Добавление товара в корзину
  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  // Фильтрация товаров по поиску и категориям
  const filteredProducts = PRODUCTS.filter((product) => {
    const title = tText(product.title, currentLanguage).toLowerCase();
    const subtitle = tText(product.subtitle, currentLanguage).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = title.includes(query) || subtitle.includes(query);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      
      {/* 1. ПОЛНОЦЕННАЯ ЗАКРЕПЛЕННАЯ ШАПКА (STICKY HEADER) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#CBE0D4] shadow-sm">
        
        {/* Верхняя часть шапки */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Бренд */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer">
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black text-[#2A4736] tracking-wider leading-none">
                AVITA GOLD
              </span>
              <span className="text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase">
                EXCLUSIVE
              </span>
            </div>
          </div>

          {/* Поиск */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tUI.searchPlaceholder}
                className="w-full bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] placeholder-gray-400 text-xs sm:text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#376C4A] transition-all"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Языки + Валюта + КОРЗИНА */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Языки */}
            <div className="flex items-center bg-[#FAF9F6] p-1 rounded-xl border border-[#CBE0D4]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setCurrentLanguage(lang.code)}
                  className={`px-2 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${
                    currentLanguage === lang.code
                      ? 'bg-[#376C4A] text-white shadow-sm'
                      : 'text-[#2A4736] hover:bg-[#EEF4F0]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Валюта (связана с CurrencyContext) */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] text-xs font-bold rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#376C4A] cursor-pointer"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>

            {/* КНОПКА КОРЗИНЫ */}
            <button
              type="button"
              className="relative bg-[#376C4A] hover:bg-[#2A4736] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              <span className="hidden sm:inline">{tUI.cart}</span>
              {cartCount > 0 && (
                <span className="bg-[#D4AF37] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* 2. КНОПКИ ВЫБОРА КАТЕГОРИЙ (ПОД ШАПКОЙ) */}
        <div className="bg-[#EEF4F0] border-t border-[#CBE0D4]/60 py-2.5 px-4 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-4 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#376C4A] text-white shadow-sm'
                    : 'bg-white text-[#2A4736] hover:bg-[#FAF9F6] border border-[#CBE0D4]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

      </header>

      {/* 3. ГЛАВНЫЙ СЛАЙДЕР ТОВАРОВ */}
      <HeroProductSlider 
        lang={currentLanguage} 
        currency={currency} 
      />

      {/* 4. КАТАЛОГ ТОВАРОВ С КНОПКАМИ "КУПИТЬ" И "В КОРЗИНУ" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8 border-b border-[#CBE0D4] pb-4">
          <h2 className="text-2xl font-bold text-[#2A4736]">
            {tUI.catalogTitle}
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Показано товаров: {filteredProducts.length}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#CBE0D4]">
            <p className="text-gray-500 text-sm">{tUI.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const formattedPrice = formatPrice(product.basePriceUZS || 0);
              const title = tText(product.title, currentLanguage);
              const subtitle = tText(product.subtitle, currentLanguage);
              const badgesList = tList(product.badges, currentLanguage);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#CBE0D4] p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Картинка */}
                    <div className="relative w-full h-48 bg-[#EEF4F0] rounded-xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                      <Image
                        src={product.image}
                        alt={title}
                        fill
                        unoptimized
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Название и описание */}
                    <h3 className="text-base font-bold text-[#2A4736] mb-1 line-clamp-1">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">
                      {subtitle}
                    </p>

                    {/* Плашки / Баджи */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {badgesList.slice(0, 2).map((badge, idx) => (
                        <span
                          key={idx}
                          className="bg-[#EEF4F0] text-[#376C4A] text-[9px] font-semibold px-2 py-0.5 rounded"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Цена и Кнопки "Купить" / "В корзину" */}
                  <div className="pt-3 border-t border-[#EEF4F0] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 block">{tUI.price}</span>
                      <span className="text-lg font-black text-[#2A4736]">
                        {formattedPrice}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {/* Кнопка В корзину */}
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="bg-[#EEF4F0] hover:bg-[#CBE0D4] text-[#2A4736] border border-[#CBE0D4] text-xs font-bold py-2 rounded-xl transition-all active:scale-95 text-center"
                      >
                        {tUI.addToCart}
                      </button>

                      {/* Кнопка Купить */}
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="bg-[#376C4A] hover:bg-[#2A4736] text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm active:scale-95 text-center"
                      >
                        {tUI.buyBtn}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}