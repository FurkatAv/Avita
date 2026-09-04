// config/currencies.ts

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rateFromUZS: number; // Курс относительно 1 UZS
  roundTo: number;     // Кратность красивого округления
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  UZS: { code: 'UZS', symbol: 'сум', rateFromUZS: 1, roundTo: 5000 },      // Базовая валюта (округление до 5 000)
  RUB: { code: 'RUB', symbol: '₽', rateFromUZS: 0.0071, roundTo: 50 },    // Пример: 480 000 UZS ≈ 3 400 ₽
  TRY: { code: 'TRY', symbol: '₺', rateFromUZS: 0.0027, roundTo: 5 },     // Пример: 480 000 UZS ≈ 1 300 ₺
  EUR: { code: 'EUR', symbol: '€', rateFromUZS: 0.000072, roundTo: 1 },   // Пример: 480 000 UZS ≈ 35 €
  PLN: { code: 'PLN', symbol: 'zł', rateFromUZS: 0.00031, roundTo: 1 },   // Пример: 480 000 UZS ≈ 150 zł
};

/**
 * Автоматический конвертер цен от узбекского сума (UZS)
 */
export function calculatePrice(basePriceUZS: number, targetCurrency: string): number {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.UZS;
  const rawPrice = basePriceUZS * config.rateFromUZS;
  
  // Маркетинговое округление вверх
  return Math.ceil(rawPrice / config.roundTo) * config.roundTo;
}