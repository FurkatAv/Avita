'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyType = 'RUB' | 'UZS' | 'TRY' | 'PLN' | 'EUR';

interface CurrencyContextType {
  currentMarket: string;
  currentCurrency: CurrencyType;
  setMarket: (market: string) => void;
  setCurrency: (currency: CurrencyType) => void;
  formatPrice: (priceInRUB: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_CURRENCIES: Record<string, CurrencyType> = {
  RU: 'RUB',
  TR: 'TRY',
  UZ: 'UZS',
  PL: 'PLN',
  DE: 'EUR',
};

// Первичное определение рынка по localStorage или языку браузера
const getInitialMarket = (): string => {
  if (typeof window === 'undefined') return 'RU';
  
  const saved = localStorage.getItem('app_market') || localStorage.getItem('avita_lang') || localStorage.getItem('NEXT_LOCALE');
  if (saved) return saved.toUpperCase();

  const navLang = (navigator.language || (navigator as any).userLanguage || 'ru').toLowerCase();
  if (navLang.startsWith('uz')) return 'UZ';
  if (navLang.startsWith('tr')) return 'TR';
  if (navLang.startsWith('pl')) return 'PL';
  if (navLang.startsWith('de')) return 'DE';
  
  return 'RU';
};

const getInitialCurrency = (market: string): CurrencyType => {
  if (typeof window === 'undefined') return 'RUB';
  const savedCurr = localStorage.getItem('app_currency') as CurrencyType;
  if (savedCurr) return savedCurr;
  return DEFAULT_CURRENCIES[market] || 'RUB';
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentMarket, setCurrentMarketState] = useState<string>(getInitialMarket);
  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyType>(() => getInitialCurrency(getInitialMarket()));

  // Установка куки и фоновое определение по IP для новых пользователей
  useEffect(() => {
    const lowerMarket = currentMarket.toLowerCase();
    // Обязательная установка cookie для серверных страниц (чтобы товары не сбрасывали язык)
    document.cookie = `NEXT_LOCALE=${lowerMarket}; path=/; max-age=31536000`;

    // Если пользователь уже выбирал рынок вручную — не заменяем его по IP
    if (localStorage.getItem('app_market')) return;

    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code) {
          const country = data.country_code.toUpperCase();
          if (['RU', 'TR', 'UZ', 'PL', 'DE'].includes(country)) {
            setCurrentMarketState(country);
            const lowerCountry = country.toLowerCase();
            
            localStorage.setItem('app_market', country);
            localStorage.setItem('avita_lang', lowerCountry);
            localStorage.setItem('NEXT_LOCALE', lowerCountry);
            document.cookie = `NEXT_LOCALE=${lowerCountry}; path=/; max-age=31536000`;

            const defCurr = DEFAULT_CURRENCIES[country] || 'RUB';
            setCurrentCurrencyState(defCurr);
            localStorage.setItem('app_currency', defCurr);
          }
        }
      })
      .catch(() => {
        // Если гео-сервер недоступен, остается язык браузера
      });
  }, []);

  // Синхронизация между вкладками браузера
  useEffect(() => {
    const handleStorage = () => {
      const savedMarket = localStorage.getItem('app_market');
      const savedCurrency = localStorage.getItem('app_currency') as CurrencyType;
      if (savedMarket) setCurrentMarketState(savedMarket);
      if (savedCurrency) setCurrentCurrencyState(savedCurrency);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setMarket = (market: string) => {
    const upperMarket = market.toUpperCase();
    const lowerMarket = market.toLowerCase();

    setCurrentMarketState(upperMarket);
    
    // Записываем во все хранилища и в Cookie (главный секрет против сброса на страницах товаров)
    localStorage.setItem('app_market', upperMarket);
    localStorage.setItem('avita_lang', lowerMarket);
    localStorage.setItem('lang', lowerMarket);
    localStorage.setItem('NEXT_LOCALE', lowerMarket);
    document.cookie = `NEXT_LOCALE=${lowerMarket}; path=/; max-age=31536000`;

    const defaultCurr = DEFAULT_CURRENCIES[upperMarket] || 'RUB';
    setCurrentCurrencyState(defaultCurr);
    localStorage.setItem('app_currency', defaultCurr);

    window.dispatchEvent(new Event('languageChange'));
    window.dispatchEvent(new Event('storage'));
  };

  const setCurrency = (currency: CurrencyType) => {
    setCurrentCurrencyState(currency);
    localStorage.setItem('app_currency', currency);
    localStorage.setItem('avita_currency', currency.toLowerCase());
    window.dispatchEvent(new Event('storage'));
  };

  const formatPrice = (priceInRUB: number) => {
    switch (currentCurrency) {
      case 'UZS':
        return `${Math.round(priceInRUB * 140).toLocaleString('ru-RU')} UZS`;
      case 'TRY':
        return `${Math.round(priceInRUB * 0.45)} ₺`;
      case 'PLN':
        return `${(priceInRUB * 0.045).toFixed(2)} zł`;
      case 'EUR':
        return `${(priceInRUB * 0.010).toFixed(2)} €`;
      case 'RUB':
      default:
        return `${priceInRUB.toLocaleString('ru-RU')} ₽`;
    }
  };

  return (
    <CurrencyContext.Provider 
      value={{ currentMarket, currentCurrency, setMarket, setCurrency, formatPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}