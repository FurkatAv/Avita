// src/components/MarketSwitcher.tsx
'use client';

import { useCurrency } from '../context/CurrencyContext';

const MARKETS = [
  { code: 'RU', label: 'RU', flag: '🇷🇺' },
  { code: 'TR', label: 'TR', flag: '🇹🇷' },
  { code: 'UZ', label: 'UZ', flag: '🇺🇿' },
  { code: 'PL', label: 'PL', flag: '🇵🇱' },
  { code: 'DE', label: 'DE', flag: '🇩🇪' },
];

export default function MarketSwitcher() {
  const { currentMarket, currentCurrency, setMarket, setCurrency } = useCurrency();

  const activeMarket = (currentMarket || 'RU').toUpperCase();

  // Функция для обработки смены рынка/языка
  const handleMarketChange = (code: string) => {
    // 1. Обновляем состояние в Context
    setMarket(code);

    const langLower = code.toLowerCase();

    // 2. Дублируем во все возможные ключи localStorage
    localStorage.setItem('avita_lang', langLower);
    localStorage.setItem('lang', langLower);
    localStorage.setItem('language', langLower);
    localStorage.setItem('NEXT_LOCALE', langLower);

    // 3. Устанавливаем Cookie для Next.js SSR
    document.cookie = `NEXT_LOCALE=${langLower}; path=/; max-age=31536000`;

    // 4. Отправляем события, чтобы все страницы мгновенно отреагировали
    window.dispatchEvent(new Event('languageChange'));
    window.dispatchEvent(new Event('storage'));
  };

  // Функция для обработки смены валюты
  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency);

    const currLower = currency.toLowerCase();
    localStorage.setItem('avita_currency', currLower);
    localStorage.setItem('currency', currLower);
    localStorage.setItem('selectedCurrency', currLower);

    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 max-w-full">
      {/* 5 кнопок языков / стран */}
      <div className="flex flex-wrap items-center gap-1 bg-white/70 p-1 rounded-xl border border-[#CBE0D4] shadow-2xs max-w-full">
        {MARKETS.map((m) => {
          const isActive = activeMarket === m.code;
          return (
            <button
              key={m.code}
              type="button"
              onClick={() => handleMarketChange(m.code)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

      {/* Переключатель валюты */}
      {activeMarket === 'RU' && (
        <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-[#CBE0D4] shadow-2xs">
          <span className="text-[10px] font-bold text-[#59655E] px-1 uppercase">Валюта:</span>
          <button
            type="button"
            onClick={() => handleCurrencyChange('RUB')}
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
            onClick={() => handleCurrencyChange('UZS')}
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