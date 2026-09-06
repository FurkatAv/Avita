// src/components/HeroProductSlider.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { UI_TRANSLATIONS, Language } from '@/data/translations';

export interface HeroProductSliderProps {
  lang?: Language | string;
  currency?: string;
  sliders?: any[];
}

export default function HeroProductSlider({
  lang = 'ru',
  sliders = [],
}: HeroProductSliderProps) {
  const activeLang: Language = (['ru', 'en', 'tr', 'uz', 'de'].includes(lang) ? lang : 'ru') as Language;
  const tUI = UI_TRANSLATIONS[activeLang] || UI_TRANSLATIONS.ru || {};

  const items = Array.isArray(sliders) ? sliders : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Коррекция индекса, если количество элементов изменилось
  const safeIndex = currentIndex >= items.length ? 0 : currentIndex;

  const nextSlide = useCallback(() => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, items.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  // Диагностический вывод в консоль браузера (F12)
  useEffect(() => {
    if (items.length > 0) {
      console.log('📸 [HeroProductSlider] Загружено слайдов:', items.length);
      console.log('📸 [HeroProductSlider] Данные первого слайда:', items[0]);
      console.log('🌐 [HeroProductSlider] NEXT_PUBLIC_SERVER_URL:', process.env.NEXT_PUBLIC_SERVER_URL);
    }
  }, [items]);

  if (!items || items.length === 0) return null;

  // Безопасное формирование URL изображения из Payload CMS
  const resolveImage = (imageField: any): string => {
    if (!imageField) return '/placeholder.png';

    let rawUrl = '';

    // 1. Если imageField — строка
    if (typeof imageField === 'string') {
      // Проверка: если строка похожа на ID Payload (без слэшей и точек), значит не передан depth
      if (!imageField.includes('/') && !imageField.includes('.')) {
        console.warn('⚠️ [HeroProductSlider] Получен ID вместо объекта картинки. Проверьте depth в API запросе к Payload:', imageField);
        return '/placeholder.png';
      }
      rawUrl = imageField;
    } 
    // 2. Если imageField — объект Payload CMS
    else if (typeof imageField === 'object') {
      rawUrl = 
        imageField.url || 
        imageField.sizes?.large?.url || 
        imageField.sizes?.card?.url || 
        (imageField.filename ? `/media/${imageField.filename}` : '');
    }

    if (!rawUrl) return '/placeholder.png';

    // 3. Нормализация относительных путей
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://') && !rawUrl.startsWith('/')) {
      rawUrl = `/${rawUrl}`;
    }

    // 4. Очистка от localhost
    if (rawUrl.startsWith('http://localhost') || rawUrl.startsWith('http://127.0.0.1')) {
      try {
        rawUrl = new URL(rawUrl).pathname;
      } catch (e) {
        // Игнорируем ошибку парсинга
      }
    }

    // 5. Приклеивание домена бэкенда к относительным путям (/media/...)
    if (rawUrl.startsWith('/')) {
      const backendUrl = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '');
      if (backendUrl) {
        rawUrl = `${backendUrl}${rawUrl}`;
      }
    }

    // 6. Исправление HTTP на HTTPS
    if (rawUrl.startsWith('http://') && !rawUrl.includes('localhost')) {
      rawUrl = rawUrl.replace('http://', 'https://');
    }

    return rawUrl;
  };

  return (
    <section className="bg-[#FAF9F6] py-4 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden bg-white rounded-3xl border border-[#CBE0D4] shadow-sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Стрелка «Назад» */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#CBE0D4] text-[#2A4736] hover:bg-[#376C4A] hover:text-white transition-all duration-200 flex items-center justify-center shadow-md active:scale-95"
              aria-label={tUI?.prevSlide || 'Предыдущий слайд'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Стрелка «Вперед» */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#CBE0D4] text-[#2A4736] hover:bg-[#376C4A] hover:text-white transition-all duration-200 flex items-center justify-center shadow-md active:scale-95"
              aria-label={tUI?.nextSlide || 'Следующий слайд'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Контейнер слайдов */}
          <div
            className="w-full flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${safeIndex * 100}%)` }}
          >
            {items.map((item, index) => {
              const imageUrl = resolveImage(item?.image);
              const title = item?.title || '';
              const link = item?.link;
              const isFeatured = item?.isFeatured;

              return (
                <div
                  key={item?.id || index}
                  className="w-full shrink-0 flex flex-col md:flex-row items-stretch justify-between bg-gradient-to-r from-[#FAF9F6] to-[#EEF4F0]"
                >
                  <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left p-6 sm:p-12 space-y-4">
                    {isFeatured && (
                      <span className="bg-[#D4AF37] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Главная витрина
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-4xl font-black text-[#2A4736] font-montserrat tracking-tight leading-tight">
                      {title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Добро пожаловать в мир эксклюзивного качества AVITA GOLD. Откройте для себя премиальную продукцию.
                    </p>

                    {link && (
                      <Link
                        href={link}
                        className="mt-2 inline-flex items-center gap-2 bg-[#376C4A] hover:bg-[#2A4736] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
                      >
                        <span>Подробнее</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    )}
                  </div>

                  <div className="relative w-full md:w-1/2 h-[260px] sm:h-[340px] md:min-h-[420px] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={title || 'Slide image'}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                      onError={() => {
                        console.error('❌ Ошибка загрузки изображения:', imageUrl);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Точки навигации (Пагинация) */}
          {items.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-20">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    safeIndex === idx ? 'w-8 bg-[#376C4A]' : 'w-2 bg-[#CBE0D4] hover:bg-[#376C4A]/50'
                  }`}
                  aria-label={`Слайд ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}