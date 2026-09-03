// components/ProductGrid.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PRODUCTS, Product } from '@/data/products';

export default function ProductGrid({ currency = 'RUB' }: { currency: keyof Product['price'] }) {
  const [purchaseType, setPurchaseType] = useState<Record<string, 'once' | 'subscribe'>>({
    'beauty-complex': 'subscribe',
    'pure-collagen': 'once'
  });

  const currencySymbols: Record<string, string> = {
    RUB: '₽',
    UZS: 'сум',
    TRY: '₺',
    EUR: '€',
    PLN: 'zł'
  };

  return (
    <section className="py-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-[#2A4736] mb-2 text-center tracking-tight font-montserrat">
          Флагманская линейка Avita Gold
        </h2>
        <p className="text-[#376C4A] text-center mb-10 text-sm font-medium">
          Инновационные формулы в удобном формате стиков на 30 дней приёма
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PRODUCTS.map((product) => {
            const isSub = purchaseType[product.id] === 'subscribe';
            const basePrice = product.price[currency] || product.price.RUB;
            const finalPrice = isSub 
              ? Math.round(basePrice * (1 - product.subscriptionDiscount / 100))
              : basePrice;

            return (
              <div 
                key={product.id}
                className="bg-white rounded-2xl border border-[#CBE0D4] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Изображение товара */}
                <div className="relative w-full h-80 bg-[#EEF4F0] p-6 flex items-center justify-center overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    unoptimized
                    className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <span className="absolute top-4 left-4 bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {product.weight} / {product.sticks} стиков
                  </span>
                </div>

                {/* Контент карточки */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#2A4736] mb-1 font-montserrat">
                      {product.title}
                    </h3>
                    <p className="text-xs text-[#376C4A] font-medium mb-4">
                      {product.subtitle}
                    </p>

                    {/* Бейджи преимуществ */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {product.badges.map((badge, idx) => (
                        <span 
                          key={idx}
                          className="bg-[#EEF4F0] text-[#2A4736] text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#CBE0D4]"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Краткий состав */}
                    <ul className="space-y-1.5 mb-6 text-xs text-gray-600 border-t border-[#EEF4F0] pt-4">
                      {product.composition.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Переключатель: Разовая / Подписка */}
                  <div className="space-y-4 pt-4 border-t border-[#EEF4F0]">
                    <div className="grid grid-cols-2 gap-2 bg-[#EEF4F0] p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPurchaseType(p => ({ ...p, [product.id]: 'once' }))}
                        className={`py-2 text-xs font-bold rounded-lg transition-all ${
                          !isSub 
                            ? 'bg-white text-[#2A4736] shadow-sm' 
                            : 'text-gray-500 hover:text-[#2A4736]'
                        }`}
                      >
                        Разовая
                      </button>
                      <button
                        type="button"
                        onClick={() => setPurchaseType(p => ({ ...p, [product.id]: 'subscribe' }))}
                        className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          isSub 
                            ? 'bg-[#376C4A] text-white shadow-sm' 
                            : 'text-gray-500 hover:text-[#376C4A]'
                        }`}
                      >
                        Курс <span className="bg-[#D4AF37] text-white text-[10px] px-1.5 py-0.5 rounded">-10%</span>
                      </button>
                    </div>

                    {/* Цена и кнопка покупки */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-[#2A4736]">
                          {finalPrice.toLocaleString()} {currencySymbols[currency]}
                        </span>
                        {isSub && (
                          <span className="block text-[11px] text-[#D4AF37] font-bold">
                            Экономия {Math.round(basePrice * 0.1).toLocaleString()} {currencySymbols[currency]}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="bg-[#376C4A] hover:bg-[#2A4736] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg active:scale-95"
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}