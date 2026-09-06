'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UI_TRANSLATIONS, Language } from '@/data/translations';
import { RichText } from '@payloadcms/richtext-lexical/react';

interface ProductDetailClientProps {
  product: any;
}

const DEFAULT_RATES: Record<string, number> = {
  USD: 1,
  RUB: 95,
  UZS: 12800,
  TRY: 34,
  EUR: 0.92,
  PLN: 4.0,
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const currencyContext = (useCurrency() || {}) as any;
  const contextCurrency = currencyContext?.currency;
  const setContextCurrency = currencyContext?.setCurrency;

  const [currentLanguage, setCurrentLanguage] = useState<Language>('ru');
  const [currency, setCurrency] = useState<string>(contextCurrency || 'USD');
  const [quantity, setQuantity] = useState<number>(1);
  
  const [cartItems, setCartItems] = useState<Array<{ product: any; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(DEFAULT_RATES);

  // Синхронизация корзины с localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('avita_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('avita_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (contextCurrency && contextCurrency !== currency) {
      setCurrency(contextCurrency);
    }
  }, [contextCurrency]);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setExchangeRates((prev) => ({ ...prev, ...data.rates }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const tUI = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.ru;

  const locales = [
    { lang: 'ru', currency: 'RUB', label: '🇷🇺 Русский (Рубль)' },
    { lang: 'ru', currency: 'UZS', label: '🇷🇺 Русский (Сум)' },
    { lang: 'uz', currency: 'UZS', label: '🇺🇿 Oʻzbekcha (Sumni)' },
    { lang: 'en', currency: 'USD', label: '🇬🇧 English (USD)' },
    { lang: 'tr', currency: 'TRY', label: '🇹🇷 Türkçe (TRY)' },
    { lang: 'de', currency: 'EUR', label: '🇩🇪 Deutsch (EUR)' },
    { lang: 'pl', currency: 'PLN', label: '🇵🇱 Polski (PLN)' },
  ];

  const getLocalizedText = (field: any, lang: string): string => {
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object') {
      return field[lang] || field.ru || Object.values(field)[0] || '';
    }
    return '';
  };

  const getProductPriceNumeric = (prod: any): number => {
    if (!prod?.price) return 0;
    const safeCurrency = (currency || 'USD').toString().toUpperCase();
    const currKey = safeCurrency.toLowerCase();

    let manualPrice: number | null = null;
    let baseUsdPrice: number | null = null;

    if (typeof prod.price === 'number') {
      baseUsdPrice = prod.price;
    } else if (typeof prod.price === 'object') {
      if (prod.price[currKey] !== undefined && prod.price[currKey] !== null && Number(prod.price[currKey]) > 0) {
        manualPrice = Number(prod.price[currKey]);
      }
      if (prod.price.usd !== undefined && prod.price.usd !== null && Number(prod.price.usd) > 0) {
        baseUsdPrice = Number(prod.price.usd);
      } else {
        const firstVal = Object.values(prod.price).find((v) => typeof v === 'number' && v > 0);
        if (firstVal) baseUsdPrice = Number(firstVal);
      }
    }

    if (manualPrice !== null) return manualPrice;
    if (baseUsdPrice !== null) {
      if (safeCurrency === 'USD') return baseUsdPrice;
      const rate = exchangeRates[safeCurrency] || DEFAULT_RATES[safeCurrency] || 1;
      return Math.round(baseUsdPrice * rate);
    }
    return 0;
  };

  const formatPriceNumber = (priceToUse: number): string => {
    const safeCurrency = (currency || 'USD').toString().toUpperCase();
    try {
      const localeMap: Record<string, string> = {
        ru: 'ru-RU',
        uz: 'uz-UZ',
        en: 'en-US',
        tr: 'tr-TR',
        de: 'de-DE',
        pl: 'pl-PL',
      };
      const locale = localeMap[currentLanguage] || 'en-US';

      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: safeCurrency,
        maximumFractionDigits: 0,
      }).format(priceToUse);
    } catch (e) {
      return `${priceToUse} ${safeCurrency}`;
    }
  };

  const handleAddToCartWithQty = (prod: any, qty: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === prod.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { product: prod, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as Array<{ product: any; quantity: number }>;
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + getProductPriceNumeric(item.product) * item.quantity, 0);

  const title = getLocalizedText(product.title, currentLanguage);
  const priceNum = getProductPriceNumeric(product);
  const firstImg = product.images?.[0]?.image;
  const imageUrl = typeof firstImg === 'string' ? firstImg : firstImg?.url || '/placeholder.jpg';

  return (
    <main className="min-h-screen bg-[#FAF9F6] pb-16">
      {/* Шапка */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#CBE0D4] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex flex-col items-center text-center">
            <div className="text-xl font-black tracking-wider leading-none flex items-center gap-1">
              <span className="text-red-600">AVITA</span>
              <span className="text-[#D4AF37]">GOLD</span>
            </div>
            <span className="text-[10px] font-bold text-red-600 tracking-widest uppercase mt-0.5">EXCLUSIVE</span>
          </Link>

          <div className="flex items-center gap-3">
            <select
              value={`${currentLanguage}-${currency}`}
              onChange={(e) => {
                const [selectedLang, selectedCurr] = e.target.value.split('-');
                setCurrentLanguage(selectedLang as Language);
                setCurrency(selectedCurr);
                if (setContextCurrency) setContextCurrency(selectedCurr);
              }}
              className="bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#376C4A]"
            >
              {locales.map((loc) => (
                <option key={`${loc.lang}-${loc.currency}`} value={`${loc.lang}-${loc.currency}`}>
                  {loc.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#376C4A] hover:bg-[#2A4736] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span>{tUI.cart}</span>
              {cartCount > 0 && (
                <span className="bg-[#D4AF37] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент товара */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#376C4A] mb-6 hover:underline">
          ← На главную в каталог
        </Link>

        <div className="bg-white rounded-3xl border border-[#CBE0D4] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 shadow-sm">
          {/* Картинка */}
          <div className="relative w-full h-[350px] sm:h-[450px] bg-[#EEF4F0] rounded-2xl flex items-center justify-center p-6 overflow-hidden">
            <Image src={imageUrl} alt={title} fill priority unoptimized className="object-contain" />
          </div>

          {/* Информация о товаре */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#2A4736] mb-2">{title}</h1>
              {product.sku && <p className="text-xs text-gray-400 mb-4">Артикул: {product.sku}</p>}

              <div className="text-3xl font-black text-[#376C4A] mb-6">
                {formatPriceNumber(priceNum * quantity)}
              </div>

              {product.description && (
                <div className="text-sm text-gray-600 mb-8 leading-relaxed">
                  <RichText data={product.description} />
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-[#EEF4F0]">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-500">Количество:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 bg-[#EEF4F0] border border-[#CBE0D4] rounded-xl font-bold text-[#2A4736] hover:bg-[#CBE0D4]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 bg-[#EEF4F0] border border-[#CBE0D4] rounded-xl font-bold text-[#2A4736] hover:bg-[#CBE0D4]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAddToCartWithQty(product, quantity)}
                  className="bg-[#EEF4F0] hover:bg-[#CBE0D4] text-[#2A4736] border border-[#CBE0D4] text-sm font-bold py-3 rounded-xl transition-all shadow-sm active:scale-95 text-center"
                >
                  {tUI.addToCart}
                </button>
                <button
                  onClick={() => handleAddToCartWithQty(product, quantity)}
                  className="bg-[#376C4A] hover:bg-[#2A4736] text-white text-sm font-bold py-3 rounded-xl transition-all shadow-sm active:scale-95 text-center"
                >
                  {tUI.buyBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Выезжающая корзина */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col">
            <div className="p-4 sm:p-6 border-b border-[#CBE0D4] flex items-center justify-between bg-[#EEF4F0]">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#2A4736]">{tUI.cart}</h2>
                <span className="bg-[#376C4A] text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-white border border-[#CBE0D4] text-[#2A4736] font-bold flex items-center justify-center hover:bg-[#FAF9F6]">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-sm mb-4">Корзина пуста</p>
                  <button onClick={() => setIsCartOpen(false)} className="bg-[#376C4A] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm">
                    Продолжить покупки
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const itemTitle = getLocalizedText(item.product.title, currentLanguage);
                  const itemImg = item.product.images?.[0]?.image;
                  const itemImgUrl = typeof itemImg === 'string' ? itemImg : itemImg?.url || '/placeholder.jpg';
                  const itemPriceStr = formatPriceNumber(getProductPriceNumeric(item.product));

                  return (
                    <div key={item.product.id} className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-[#CBE0D4] rounded-2xl">
                      <div className="relative w-16 h-16 bg-white rounded-xl border border-[#CBE0D4] shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <Image src={itemImgUrl} alt={itemTitle} fill unoptimized className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#2A4736] line-clamp-1">{itemTitle}</h4>
                        <p className="text-xs font-black text-[#376C4A] mt-1">{itemPriceStr}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="w-7 h-7 bg-white border border-[#CBE0D4] rounded-lg font-bold text-xs text-[#2A4736]">-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="w-7 h-7 bg-white border border-[#CBE0D4] rounded-lg font-bold text-xs text-[#2A4736]">+</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-[#CBE0D4] bg-[#EEF4F0] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">Итого:</span>
                  <span className="text-lg font-black text-[#2A4736]">{formatPriceNumber(cartTotalPrice)}</span>
                </div>
                <button type="button" onClick={() => alert('Переход к оформлению заказа...')} className="w-full bg-[#376C4A] hover:bg-[#2A4736] text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-center">
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}