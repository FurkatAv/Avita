// config/markets.ts
export interface MarketConfig {
  code: string;       // ISO country code
  language: string;   // Default language ('tr', 'uz', 'pl', 'de', 'ru')
  currency: string;   // Currency code ('TRY', 'UZS', 'PLN', 'EUR', 'RUB')
  symbol: string;     // Currency symbol ('₺', 'so\'m', 'zł', '€', '₽')
  rate: number;       // Conversion rate relative to RUB base
}

export const MARKETS: Record<string, MarketConfig> = {
  TR: { code: 'TR', language: 'tr', currency: 'TRY', symbol: '₺', rate: 0.45 },
  UZ: { code: 'UZ', language: 'uz', currency: 'UZS', symbol: 'so\'m', rate: 450 },
  PL: { code: 'PL', language: 'pl', currency: 'PLN', symbol: 'zł', rate: 0.043 },
  DE: { code: 'DE', language: 'de', currency: 'EUR', symbol: '€', rate: 0.01 },
  RU: { code: 'RU', language: 'ru', currency: 'RUB', symbol: '₽', rate: 1.0 },
};

// Обязательно с экспортом!
export const DEFAULT_MARKET: MarketConfig = MARKETS.RU;