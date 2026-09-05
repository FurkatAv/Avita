'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PRODUCTS, tText, tList } from '@/data/products';
import { UI_TRANSLATIONS, Language } from '@/data/translations';
import { useCurrency } from '@/context/CurrencyContext';

export interface HeroProductSliderProps {
  lang?: Language | string;
  currency?: string;
  sliders?: any[]; // Поддержка динамических данных из Payload CMS с фоллбеком на статику
}

export default function HeroProductSlider({
  lang = 'ru',
  sliders = [],
}: HeroProductSliderProps) {
  const { formatPrice } = useCurrency();

  // Безопасное приведение языка
  const activeLang: Language = (['ru', 'en', 'tr', 'uz', 'de'].includes(lang) ? lang : 'ru') as Language;
  const tUI = UI_TRANSLATIONS[activeLang] || UI_TRANSLATIONS.ru;

  // Используем данные из Payload CMS, если они есть, иначе фоллбек на статический массив
  const items = sliders && sliders.length > 0 ? sliders : PRODUCTS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Автопрокрутка с очисткой таймера
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, items.length]);

  // Сброс индекса при изменении набора данных
  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  // Хелпер для безопасного получения URL изображения (поддержка Payload Media объектов и строк)
  const resolveImage = (imageField: any): string => {
    if (!imageField) return '/placeholder.png';
    if (typeof imageField === 'string') return imageField;
    return imageField.url || '/placeholder.png';
  };

  return (
    <section className="bg-[#FAF9F6] py-0 border-b border-[#CBE0D4]/40 w-full">
      <div className="max-w-7xl mx-auto px-0 sm:px-4">
        <div
          className="relative overflow-hidden bg-white border-x border-[#CBE0D4] shadow-sm py-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Кнопка «Назад» */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#CBE0D4] text-[#2A4736] hover:bg-[#376C4A] hover:text-white transition-all duration-200 flex items-center justify-center shadow-md active:scale-95"
            aria-label={tUI.prevSlide}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Кнопка «Вперед» */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#CBE0D4] text-[#2A4736] hover:bg-[#376C4A] hover:text-white transition-all duration-200 flex items-center justify-center shadow-md active:scale-95"
            aria-label={tUI.nextSlide}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Трек слайдера */}
          <div
            className="w-full flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => {
              // Поддержка полей как из статической структуры, так и из Payload CMS
              const imageUrl = resolveImage(item.image);
              const title = typeof item.title === 'string' ? item.title : tText(item.title, activeLang);
              const subtitle = typeof item.subtitle === 'string' ? item.subtitle : tText(item.subtitle, activeLang);
              const compositionList = Array.isArray(item.composition) 
                ? item.composition.map((c: any) => (typeof c === 'string' ? c : c.text || '')) 
                : tList(item.composition, activeLang);
              
              const badgesList = Array.isArray(item.badges)
                ? item.badges.map((b: any) => (typeof b === 'string' ? b : b.text || ''))
                : tList(item.badges, activeLang);

              const priceValue = item.basePriceUZS ?? item.price ?? 0;
              const formattedPrice = formatPrice(priceValue);

              return (
                <div
                  key={item.id || index}
                  className="w-full shrink-0 flex flex-col md:flex-row p-4 sm:p-8 items-center justify-between gap-6 px-10 sm:px-14"
                >
                  {/* Изображение */}
                  <div className="relative w-full md:w-1/2 h-60 md:h-72 bg-[#EEF4F0] rounded-xl p-4 flex items-center justify-center border border-[#CBE0D4]/50 shrink-0">
                    <Image
                      src={imageUrl}
                      alt={title || 'Product image'}
                      priority={index === 0}
                      fill
                      unoptimized
                      className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {item.weight && (
                        <span className="bg-[#D4AF37] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                          {item.weight}
                        </span>
                      )}
                      {item.sticks && (
                        <span className="bg-white/90 backdrop-blur-md text-[#2A4736] text-[10px] font-bold px-2 py-0.5 rounded border border-[#CBE0D4]">
                          {item.sticks} {tUI.sticksLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Контент */}
                  <div className="w-full md:w-1/2 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#2A4736] font-montserrat mb-2">
                        {title}
                      </h3>
                      {subtitle && (
                        <p className="text-xs sm:text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">
                          {subtitle}
                        </p>
                      )}

                      {/* Состав */}
                      {compositionList.length > 0 && (
                        <div className="space-y-1 mb-3">
                          {compositionList.slice(0, 4).map((compItem: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#2A4736]">
                              <span className="text-[#376C4A] font-bold">✓</span>
                              <span>{compItem}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Бэджи */}
                      {badgesList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {badgesList.map((badge: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-[#EEF4F0] text-[#376C4A] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#CBE0D4]"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Цена и Кнопка заказа */}
                    <div className="pt-3 border-t border-[#EEF4F0] flex items-center justify-between gap-4 mt-auto">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-medium">{tUI.price}</span>
                        <span className="text-lg sm:text-xl font-black text-[#2A4736]">
                          {formattedPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="bg-[#376C4A] hover:bg-[#2A4736] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
                      >
                        <span>{tUI.orderBtn}</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Индикаторы (точки) */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? 'w-6 bg-[#376C4A]' : 'w-1.5 bg-[#CBE0D4] hover:bg-[#376C4A]/50'
                }`}
                aria-label={`Слайд ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}