// components/HeroProductSlider.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PRODUCTS, tText, tList } from '@/data/products';
import { UI_TRANSLATIONS, Language } from '@/data/translations';
import { useCurrency } from '@/context/CurrencyContext';

interface HeroProductSliderProps {
  lang?: Language | string;
  currency?: string;
}

export default function HeroProductSlider({
  lang = 'ru'
}: HeroProductSliderProps) {
  const { formatPrice } = useCurrency();

  // Приводим код языка к поддерживаемому диапазону (по умолчанию 'ru')
  const activeLang: Language = (['ru', 'en', 'tr', 'uz', 'de'].includes(lang) ? lang : 'ru') as Language;
  const tUI = UI_TRANSLATIONS[activeLang] || UI_TRANSLATIONS.ru;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % PRODUCTS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + PRODUCTS.length) % PRODUCTS.length);
  }, []);

  // Автоматическое листание каждые 5 секунд (5000 мс)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section className="bg-[#FAF9F6] py-8 border-b border-[#CBE0D4]/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Шапка секции */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-[#EEF4F0] text-[#376C4A] text-xs font-bold px-3 py-1 rounded-full border border-[#CBE0D4] uppercase tracking-wider">
              {tUI.catalogTitle}
            </span>
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">
              {tUI.autoScroll}
            </span>
          </div>
        </div>

        {/* Главный контейнер слайдера */}
        <div
          className="relative overflow-hidden rounded-3xl border border-[#CBE0D4] bg-white shadow-lg pb-8 pt-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* СТРЕЛКА ВЛЕВО (По левому краю) */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-[#CBE0D4] text-[#2A4736] hover:bg-[#376C4A] hover:text-white transition-all duration-200 flex items-center justify-center shadow-md active:scale-95"
            aria-label={tUI.prevSlide}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* СТРЕЛКА ВПРАВО (По правому краю) */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-[#CBE0D4] text-[#2A4736] hover:bg-[#376C4A] hover:text-white transition-all duration-200 flex items-center justify-center shadow-md active:scale-95"
            aria-label={tUI.nextSlide}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Горизонтальный трек товаров */}
          <div
            className="w-full flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {PRODUCTS.map((product) => {
              const formattedPrice = formatPrice(product.basePriceUZS || 0);
              const title = tText(product.title, activeLang);
              const subtitle = tText(product.subtitle, activeLang);
              const compositionList = tList(product.composition, activeLang);
              const badgesList = tList(product.badges, activeLang);

              return (
                <div
                  key={product.id}
                  className="w-full shrink-0 flex flex-col md:flex-row p-6 sm:p-10 items-center justify-between gap-6 px-12 sm:px-16"
                >
                  {/* Изображение товара */}
                  <div className="relative w-full md:w-1/2 h-64 md:h-80 bg-[#EEF4F0] rounded-2xl p-4 flex items-center justify-center border border-[#CBE0D4]/50 shrink-0">
                    <Image
                      src={product.image}
                      alt={title}
                      fill
                      unoptimized
                      className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="bg-[#D4AF37] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                        {product.weight}
                      </span>
                      <span className="bg-white/90 backdrop-blur-md text-[#2A4736] text-[10px] font-bold px-2 py-0.5 rounded border border-[#CBE0D4]">
                        {product.sticks} {tUI.sticksLabel}
                      </span>
                    </div>
                  </div>

                  {/* Описание и состав */}
                  <div className="w-full md:w-1/2 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#2A4736] font-montserrat mb-2">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-4 leading-relaxed">
                        {subtitle}
                      </p>

                      {/* Ключевые преимущества / Состав */}
                      <div className="space-y-1.5 mb-4">
                        {compositionList.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#2A4736]">
                            <span className="text-[#376C4A] font-bold">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Сертификаты и баджи */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {badgesList.map((badge, idx) => (
                          <span
                            key={idx}
                            className="bg-[#EEF4F0] text-[#376C4A] text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded border border-[#CBE0D4]"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Цена и Кнопка */}
                    <div className="pt-4 border-t border-[#EEF4F0] flex items-center justify-between gap-4 mt-auto">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-medium">{tUI.price}</span>
                        <span className="text-xl sm:text-2xl font-black text-[#2A4736]">
                          {formattedPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="bg-[#376C4A] hover:bg-[#2A4736] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
                      >
                        <span>{tUI.orderBtn}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Точки-индикаторы по центру снизу */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {PRODUCTS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? 'w-7 bg-[#376C4A]' : 'w-2 bg-[#CBE0D4] hover:bg-[#376C4A]/50'
                }`}
                aria-label={`Перейти к слайду ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}