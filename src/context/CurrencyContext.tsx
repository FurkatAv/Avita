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

// Валюты по умолчанию для рынков
const DEFAULT_CURRENCIES: Record<string, CurrencyType> = {
  RU: 'RUB',
  TR: 'TRY',
  UZ: 'UZS',
  PL: 'PLN',
  DE: 'EUR',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentMarket, setCurrentMarketState] = useState<string>('RU');
  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyType>('RUB');

  useEffect(() => {
    const savedMarket = localStorage.getItem('app_market');
    const savedCurrency = localStorage.getItem('app_currency') as CurrencyType;

    if (savedMarket) setCurrentMarketState(savedMarket);
    if (savedCurrency) setCurrentCurrencyState(savedCurrency);
  }, []);

  const setMarket = (market: string) => {
    const upperMarket = market.toUpperCase();
    setCurrentMarketState(upperMarket);
    localStorage.setItem('app_market', upperMarket);

    // Автоматически ставим стандартную валюту для страны, если пользователь еще не выбирал
    const defaultCurr = DEFAULT_CURRENCIES[upperMarket] || 'RUB';
    setCurrentCurrencyState(defaultCurr);
    localStorage.setItem('app_currency', defaultCurr);
  };

  const setCurrency = (currency: CurrencyType) => {
    setCurrentCurrencyState(currency);
    localStorage.setItem('app_currency', currency);
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