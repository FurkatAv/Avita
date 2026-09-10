'use client';

import React, { useState } from 'react';

interface BenefitItem {
  id: string;
  badgeText: string;
  title: string;
  subtitle: string;
  fullDescription: string;
  certificateRef?: string;
  icon: React.ReactNode;
}

const benefitsData: BenefitItem[] = [
  {
    id: 'pure-collagen',
    badgeText: 'Type I & III',
    title: '100% Bioactive Collagen',
    subtitle: 'Высокая усвояемость 2000 Da',
    fullDescription: 'Низкомолекулярные гидролизованные пептиды бычьего коллагена I и III типа с высокой степенью очистки. Всасываются до 98% в первые 30 минут.',
    certificateRef: 'ISO 22000 / GMP Compliant',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.605 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 'halal',
    badgeText: 'Halal Certified',
    title: 'Халяль Сертификат',
    subtitle: '100% Натуральное сырье',
    fullDescription: 'Продукция сертифицирована Международным центром Халяль. Полное отсутствие свиного желатина, спирта и химических добавок.',
    certificateRef: 'Сертификат № HLL-2025/TR-884',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'premium-formula',
    badgeText: 'Zero Additives',
    title: 'Чистая Формула',
    subtitle: 'Без сахара, ГМО и глютена',
    fullDescription: 'Формула обогащена гиалуроновой кислотой, витамином C и цинком для максимальной синергии синтеза собственного коллагена.',
    certificateRef: 'Lab Tested & Approved',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'eu-standards',
    badgeText: 'EU Import',
    title: 'Стандарт ЕС',
    subtitle: 'Европейский контроль качества',
    fullDescription: 'Произведено из сертифицированного европейского сырья с прохождением многоступенчатого контроля качества на каждом этапе.',
    certificateRef: 'European Quality Mark',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2 0 012-2h1.055" />
      </svg>
    ),
  },
];

export const ProductBenefitsAdvanced: React.FC = () => {
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitItem | null>(null);

  return (
    <section className="w-full my-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-amber-600 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Стандарты Качества Avita Gold
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefitsData.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedBenefit(item)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl p-[1px] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-300/40 via-amber-500/20 to-[#376C4A]/30 group-hover:from-amber-400 group-hover:to-amber-600 transition-all rounded-2xl" />

            <div className="relative h-full w-full rounded-[15px] bg-white p-5 flex flex-col justify-between transition-colors group-hover:bg-[#FAF9F6]">
              <div className="flex items-center justify-between mb-4">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px] shadow-sm">
                  <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white text-[#376C4A]">
                    {item.icon}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  {item.badgeText}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#2A4736] group-hover:text-[#376C4A]">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EEF4F0] flex items-center justify-between text-[11px] text-amber-700 font-semibold">
                <span>Подробнее</span>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBenefit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-300 bg-white p-6 text-stone-900 shadow-2xl">
            <button
              onClick={() => setSelectedBenefit(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 hover:text-stone-900 hover:bg-stone-100 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 text-stone-950 shadow-md">
                {selectedBenefit.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  {selectedBenefit.badgeText}
                </span>
                <h3 className="text-lg font-bold text-[#2A4736]">
                  {selectedBenefit.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {selectedBenefit.fullDescription}
            </p>

            {selectedBenefit.certificateRef && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 font-medium">
                <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{selectedBenefit.certificateRef}</span>
              </div>
            )}

            <button
              onClick={() => setSelectedBenefit(null)}
              className="mt-6 w-full rounded-xl bg-[#376C4A] hover:bg-[#2A4736] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </section>
  );
};