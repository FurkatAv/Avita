'use client';

import { useCurrency, CurrencyType } from '../context/CurrencyContext';

const MARKETS = [
  { code: 'RU', label: 'RU', flag: '🇷🇺' },
  { code: 'TR', label: 'TR', flag: '🇹🇷' },
  { code: 'UZ', label: 'UZ', flag: '🇺🇿' },
  { code: 'PL', label: 'PL', flag: '🇵🇱' },
  { code: 'DE', label: 'DE', flag: '🇩🇪' },
];

export function MarketSwitcher() {
  const { currentMarket, currentCurrency, setMarket, setCurrency } = useCurrency();

  const activeMarket = (currentMarket || 'RU').toUpperCase();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 5 кнопок языков / стран */}
      <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-[#CBE0D4] shadow-2xs">
        {MARKETS.map((m) => {
          const isActive = activeMarket === m.code;
          return (
            <button
              key={m.code}
              type="button"
              onClick={() => setMarket(m.code)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#376C4A] text-white shadow-xs scale-105'
                  : 'text-[#2A4736] hover:bg-[#E3ECE6]'
              }`}
            >
              <span>{m.flag}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Переключатель валюты при выборе русского языка (RUB vs UZS) */}
      {activeMarket === 'RU' && (
        <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-[#CBE0D4] shadow-2xs">
          <span className="text-[10px] font-bold text-[#59655E] px-1 uppercase">Валюта:</span>
          <button
            type="button"
            onClick={() => setCurrency('RUB')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
              currentCurrency === 'RUB'
                ? 'bg-[#D4AF37] text-white shadow-xs'
                : 'text-[#2A4736] hover:bg-[#E3ECE6]'
            }`}
          >
            ₽ (RUB)
          </button>
          <button
            type="button"
            onClick={() => setCurrency('UZS')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
              currentCurrency === 'UZS'
                ? 'bg-[#D4AF37] text-white shadow-xs'
                : 'text-[#2A4736] hover:bg-[#E3ECE6]'
            }`}
          >
            сум (UZS)
          </button>
        </div>
      )}
    </div>
  );
}