'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
  const tUI = UI_TRANSLATIONS[activeLang] || UI_TRANSLATIONS.ru;

  const items = sliders && sliders.length > 0 ? sliders : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
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

  if (!items || items.length === 0) return null;

  const resolveImage = (imageField: any): string => {
    if (!imageField) return '/placeholder.png';
    if (typeof imageField === 'string') return imageField;
    return imageField.url || '/placeholder.png';
  };

  return (
    <section className="bg-[#FAF9F6] py-4 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden bg-white rounded-3xl border border-[#CBE0D4] shadow-sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {items.length > 1 && (
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#CBE0D4] text-[#2A4736] hover:bg-[#376C4A] hover:text-white transition-all duration-200 flex items-center justify-center shadow-md active:scale-95"
              aria-label={tUI.prevSlide}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {items.length > 1 && (
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#CBE0D4] text-[#2A4736] hover:bg-[#376C4A] hover:text-white transition-all duration-200 flex items-center justify-center shadow-md active:scale-95"
              aria-label={tUI.nextSlide}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            className="w-full flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => {
              const imageUrl = resolveImage(item.image);
              const title = item.title || '';
              const link = item.link;
              const isFeatured = item.isFeatured;

              return (
                <div
                  key={item.id || index}
                  className="w-full shrink-0 flex flex-col md:flex-row items-stretch justify-between bg-gradient-to-r from-[#FAF9F6] to-[#EEF4F0]"
                >
                  {/* Текстовая часть */}
                  <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left p-6 sm:p-12 space-y-4">
                    {isFeatured && (
                      <span className="bg-[#D4AF37] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Главная витрина
                      </span>
                    )}
                    <h2 className="text-3xl sm:text-4xl font-black text-[#2A4736] font-montserrat tracking-tight leading-tight">
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

                  {/* Картинка на весь край */}
                  <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-[420px] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={title || 'Slide image'}
                      priority={index === 0}
                      fill
                      unoptimized
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {items.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-20">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    currentIndex === idx ? 'w-8 bg-[#376C4A]' : 'w-2 bg-[#CBE0D4] hover:bg-[#376C4A]/50'
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