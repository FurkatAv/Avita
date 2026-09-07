'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface Slide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface SplitCarouselProps {
  slides: Slide[];
}

export default function SplitCarousel({ slides }: SplitCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full bg-white rounded-2xl border border-[#CBE0D4] overflow-hidden shadow-sm group">
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.id || index}
              className="flex-[0_0_100%] min-w-0 relative"
            >
              <div className="relative min-h-[380px] sm:min-h-[420px] grid grid-cols-1 md:grid-cols-12 items-stretch">
                
                <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-start z-10 bg-white overflow-y-auto no-scrollbar">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#376C4A] uppercase tracking-wider mb-2 block">
                      Avita Gold
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#2A4736] leading-tight">
                      {slide.title}
                    </h2>
                  </div>
                </div>

                <div className="md:col-span-6 relative h-[260px] md:h-full bg-[#EEF4F0] overflow-hidden border-y md:border-y-0 md:border-x border-[#CBE0D4]">
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={slide.imageUrl || '/placeholder.jpg'}
                      alt={slide.title || 'Banner'}
                      fill
                      unoptimized
                      priority={index === 0}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-start z-10 bg-white overflow-y-auto no-scrollbar">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <button
          onClick={handlePrev}
          aria-label="Предыдущий слайд"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#CBE0D4] text-[#2A4736] flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 opacity-80 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {slides.length > 1 && (
        <button
          onClick={handleNext}
          aria-label="Следующий слайд"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#CBE0D4] text-[#2A4736] flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 opacity-80 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-3 right-6 z-25 flex gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index ? 'w-6 bg-[#376C4A]' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}