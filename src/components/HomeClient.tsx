'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UI_TRANSLATIONS, Language } from '@/data/translations';

interface HomeClientProps {
  sliders: any[];
  products?: any[];
}

const DEFAULT_RATES: Record<string, number> = {
  USD: 1,
  RUB: 95,
  UZS: 12800,
  TRY: 34,
  EUR: 0.92,
  PLN: 4.0,
};

export default function HomeClient({ sliders = [], products = [] }: HomeClientProps) {
  const currencyContext = (useCurrency() || {}) as any;
  const contextCurrency = currencyContext?.currency;
  const setContextCurrency = currencyContext?.setCurrency;

  const [currentLanguage, setCurrentLanguage] = useState<Language>('ru');
  const [currency, setCurrency] = useState<string>(contextCurrency || 'USD');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Корзина и состояние открытия боковой панели
  const [cartItems, setCartItems] = useState<Array<{ product: any; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(DEFAULT_RATES);

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
      .catch((err) => {
        console.error('Ошибка загрузки актуальных курсов валют:', err);
      });
  }, []);

  useEffect(() => {
    if (!sliders || sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders]);

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

  const categories = [
    { id: 'all', label: tUI.allCategories },
    { id: 'collagen', label: tUI.catCollagen },
    { id: 'complexes', label: tUI.catComplexes },
    { id: 'vitamins', label: tUI.catVitamins },
    { id: 'amino', label: tUI.catAmino },
  ];

  // Функция добавления товара в корзину и открытия корзины
  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Изменение количества товара в корзине
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

  const getLocalizedText = (field: any, lang: string): string => {
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object') {
      return field[lang] || field.ru || Object.values(field)[0] || '';
    }
    return '';
  };

  // Вычисление чистой цены в виде числа для расчетов общей суммы
  const getProductPriceNumeric = (product: any): number => {
    if (!product?.price) return 0;
    const safeCurrency = (currency || 'USD').toString().toUpperCase();
    const currKey = safeCurrency.toLowerCase();

    let manualPrice: number | null = null;
    let baseUsdPrice: number | null = null;

    if (typeof product.price === 'number') {
      baseUsdPrice = product.price;
    } else if (typeof product.price === 'object') {
      if (product.price[currKey] !== undefined && product.price[currKey] !== null && Number(product.price[currKey]) > 0) {
        manualPrice = Number(product.price[currKey]);
      }
      if (product.price.usd !== undefined && product.price.usd !== null && Number(product.price.usd) > 0) {
        baseUsdPrice = Number(product.price.usd);
      } else {
        const firstVal = Object.values(product.price).find((v) => typeof v === 'number' && v > 0);
        if (firstVal) {
          baseUsdPrice = Number(firstVal);
        }
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

  const getProductPriceString = (product: any): string => {
    const num = getProductPriceNumeric(product);
    if (num === 0) return '—';
    return formatPriceNumber(num);
  };

  const cartTotalPrice = cartItems.reduce((sum, item) => {
    return sum + getProductPriceNumeric(item.product) * item.quantity;
  }, 0);

  const getImageUrl = (product: any): string => {
    const firstImg = product.images?.[0]?.image;
    if (typeof firstImg === 'string') return firstImg;
    if (firstImg?.url) return firstImg.url;
    return '/placeholder.jpg';
  };

  const filteredProducts = products.filter((product) => {
    const title = getLocalizedText(product.title, currentLanguage).toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query);
    const matchesCategory =
      selectedCategory === 'all' ||
      product.categories?.some(
        (cat: any) => (typeof cat === 'string' ? cat : cat.id || cat.slug) === selectedCategory
      );
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#FAF9F6] m-0 p-0 overflow-x-hidden relative">
      {/* 1. ШАПКА САЙТА */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#CBE0D4] shadow-sm m-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0 cursor-pointer">
            <Link href="/" className="flex flex-col items-center text-center">
              <div className="text-base sm:text-xl font-black tracking-wider leading-none flex items-center gap-1">
                <span className="text-red-600">AVITA</span>
                <span className="text-[#D4AF37]">GOLD</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-red-600 tracking-widest uppercase mt-0.5">
                EXCLUSIVE
              </span>
            </Link>
          </div>

          <div className="flex-1 min-w-0 max-w-md mx-1 sm:mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tUI.searchPlaceholder}
                className="w-full bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] placeholder-gray-400 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#376C4A] transition-all"
              />
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <select
              value={`${currentLanguage}-${currency}`}
              onChange={(e) => {
                const [selectedLang, selectedCurr] = e.target.value.split('-');
                setCurrentLanguage(selectedLang as Language);
                setCurrency(selectedCurr);
                if (setContextCurrency) {
                  setContextCurrency(selectedCurr);
                }
              }}
              className="w-[105px] sm:w-auto bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] text-[11px] sm:text-xs font-bold rounded-xl px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#376C4A] cursor-pointer"
            >
              {locales.map((loc) => (
                <option key={`${loc.lang}-${loc.currency}`} value={`${loc.lang}-${loc.currency}`}>
                  {loc.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#376C4A] hover:bg-[#2A4736] text-white font-bold text-xs px-2.5 sm:px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="hidden sm:inline">{tUI.cart}</span>
              {cartCount > 0 && (
                <span className="bg-[#D4AF37] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#EEF4F0] border-t border-[#CBE0D4]/60 py-2 px-4 overflow-x-auto no-scrollbar m-0">
          <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-4 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#376C4A] text-white shadow-sm'
                    : 'bg-white text-[#2A4736] hover:bg-[#FAF9F6] border border-[#CBE0D4]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. КОМПАКТНАЯ КАРУСЕЛЬ */}
      {sliders && sliders.length > 0 && (
        <div className="relative w-full overflow-hidden m-0 p-0 leading-none bg-[#EBF4FA]">
          <div
            className="flex transition-transform duration-700 ease-in-out w-full m-0 p-0"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliders.map((slide, index) => {
              const slideTitle = getLocalizedText(slide.title, currentLanguage);
              const slideImg = typeof slide.image === 'string' ? slide.image : slide.image?.url || '';

              return (
                <div key={slide.id || index} className="w-full flex-shrink-0 relative m-0 p-0">
                  <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[380px] bg-[#EBF4FA] flex items-center justify-center m-0 p-0">
                    {slideImg && (
                      <Image
                        src={slideImg}
                        alt={slideTitle || 'Banner'}
                        fill
                        unoptimized
                        priority={index === 0}
                        className="w-full h-full object-contain m-0 p-0"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {sliders.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {sliders.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-[#376C4A]' : 'w-1.5 bg-[#2A4736]/30 hover:bg-[#2A4736]/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. КАТАЛОГ ТОВАРОВ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12 m-0 mt-0">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#CBE0D4] mt-0">
            <p className="text-gray-500 text-sm">{tUI.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-0 mt-0">
            {filteredProducts.map((product) => {
              const title = getLocalizedText(product.title, currentLanguage);
              const priceString = getProductPriceString(product);
              const imageUrl = getImageUrl(product);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#CBE0D4] p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group mt-0"
                >
                  {/* Кликабельная область для перехода на карточку товара */}
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative w-full h-48 bg-[#EEF4F0] rounded-xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        unoptimized
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="text-base font-bold text-[#2A4736] mb-1 line-clamp-1 group-hover:text-[#376C4A] transition-colors">
                      {title}
                    </h3>

                    {product.sku && (
                      <p className="text-[10px] text-gray-400 mb-2">
                        Артикул: {product.sku}
                      </p>
                    )}
                  </Link>

                  <div className="pt-3 border-t border-[#EEF4F0] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 block">{tUI.price}</span>
                      <span className="text-lg font-black text-[#2A4736]">
                        {priceString}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#EEF4F0] hover:bg-[#CBE0D4] text-[#2A4736] border border-[#CBE0D4] text-xs font-bold py-2 rounded-xl transition-all active:scale-95 text-center"
                      >
                        {tUI.addToCart}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#376C4A] hover:bg-[#2A4736] text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm active:scale-95 text-center"
                      >
                        {tUI.buyBtn}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. ВЫЕЗЖАЮЩАЯ КОРЗИНА (DRAWER) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Затемнение фона */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Боковая панель */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col">
            {/* Заголовок корзины */}
            <div className="p-4 sm:p-6 border-b border-[#CBE0D4] flex items-center justify-between bg-[#EEF4F0]">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#2A4736]">{tUI.cart}</h2>
                <span className="bg-[#376C4A] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#CBE0D4] text-[#2A4736] font-bold flex items-center justify-center hover:bg-[#FAF9F6]"
              >
                ✕
              </button>
            </div>

            {/* Список товаров в корзине */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-sm mb-4">Корзина пуста</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#376C4A] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm"
                  >
                    Перейти к покупкам
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const title = getLocalizedText(item.product.title, currentLanguage);
                  const priceStr = getProductPriceString(item.product);
                  const imgUrl = getImageUrl(item.product);

                  return (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-[#CBE0D4] rounded-2xl"
                    >
                      <div className="relative w-16 h-16 bg-white rounded-xl border border-[#CBE0D4] shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <Image src={imgUrl} alt={title} fill unoptimized className="object-contain" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#2A4736] line-clamp-1">{title}</h4>
                        <p className="text-xs font-black text-[#376C4A] mt-1">{priceStr}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-7 h-7 bg-white border border-[#CBE0D4] rounded-lg font-bold text-xs text-[#2A4736] hover:bg-[#EEF4F0]"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-7 h-7 bg-white border border-[#CBE0D4] rounded-lg font-bold text-xs text-[#2A4736] hover:bg-[#EEF4F0]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Итог и кнопка оформления заказа */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-[#CBE0D4] bg-[#EEF4F0] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">Итого:</span>
                  <span className="text-lg font-black text-[#2A4736]">
                    {formatPriceNumber(cartTotalPrice)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert('Переход к оформлению заказа...');
                  }}
                  className="w-full bg-[#376C4A] hover:bg-[#2A4736] text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-center"
                >
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