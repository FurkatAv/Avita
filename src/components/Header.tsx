'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MarketSwitcher from './MarketSwitcher';
import CartDrawer, { CartItem } from './CartDrawer';

export interface HeaderProps {
  lang?: string;
  currency?: string;
}

// Переводы для меню Шапки
const menuTranslations: Record<string, Record<string, string>> = {
  ru: { home: 'Главная', catalog: 'Каталог', about: 'О нас', contact: 'Контакты', cart: 'Корзина', market: 'Выбор страны / валюты' },
  uz: { home: 'Bosh sahifa', catalog: 'Katalog', about: 'Biz haqimizda', contact: 'Aloqa', cart: 'Savat', market: 'Mamlakat / Valyuta' },
  en: { home: 'Home', catalog: 'Catalog', about: 'About Us', contact: 'Contacts', cart: 'Cart', market: 'Country / Currency' },
  de: { home: 'Startseite', catalog: 'Katalog', about: 'Über uns', contact: 'Kontakte', cart: 'Warenkorb', market: 'Land / Währung' },
  tr: { home: 'Ana Sayfa', catalog: 'Katalog', about: 'Hakkımızda', contact: 'İletişim', cart: 'Sepet', market: 'Ülke / Para Birimi' },
  pl: { home: 'Strona główna', catalog: 'Katalog', about: 'O nas', contact: 'Kontakt', cart: 'Koszyk', market: 'Kraj / Waluta' },
};

export default function Header({}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('ru');

  // Синхронизация языка в Шапке
  useEffect(() => {
    const loadLang = () => {
      const savedLang = (
        localStorage.getItem('avita_lang') || 
        localStorage.getItem('lang') || 
        localStorage.getItem('language') || 
        localStorage.getItem('NEXT_LOCALE') || 
        'ru'
      ).toLowerCase().slice(0, 2);

      setCurrentLang(savedLang);
    };

    loadLang();

    window.addEventListener('storage', loadLang);
    window.addEventListener('languageChange', loadLang);

    return () => {
      window.removeEventListener('storage', loadLang);
      window.removeEventListener('languageChange', loadLang);
    };
  }, []);

  const t = (key: string) => menuTranslations[currentLang]?.[key] || menuTranslations['ru'][key] || key;

  // Временное состояние товаров
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Avita Gold Beauty Collagen 100% Pure',
      price: 35,
      quantity: 1,
      image: '/images/products/beauty-collagen-box.jpg',
    },
    {
      id: '2',
      name: 'Collagen Complex in Box',
      price: 45,
      quantity: 2,
      image: '/images/products/collagen-komplex-box.jpg',
    },
  ]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#CBE0D4] shadow-sm w-full max-w-full overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Логотип */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-xl sm:text-2xl font-black text-[#2A4736] font-montserrat tracking-tight group-hover:text-[#376C4A] transition-colors">
                  AVITA <span className="text-[#D4AF37]">GOLD</span>
                </span>
              </Link>
            </div>

            {/* Навигация для десктопа */}
            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#2A4736]">
              <Link href="/" className="hover:text-[#376C4A] transition-colors">
                {t('home')}
              </Link>
              <Link href="/catalog" className="hover:text-[#376C4A] transition-colors">
                {t('catalog')}
              </Link>
              <Link href="/about" className="hover:text-[#376C4A] transition-colors">
                {t('about')}
              </Link>
              <Link href="/contact" className="hover:text-[#376C4A] transition-colors">
                {t('contact')}
              </Link>
            </nav>

            {/* Переключатель рынка/языка + Кнопка корзины + Мобильная кнопка */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block">
                <MarketSwitcher />
              </div>

              {/* Интерактивная кнопка корзины */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#22060b] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#3d0c15] hover:border-[#d4af37] transition-all cursor-pointer shadow-sm group"
                aria-label="Открыть корзину"
              >
                <svg className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                  {t('cart')}
                </span>
                
                {/* Бейдж количества */}
                {totalItemsCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black rounded-full bg-[#d4af37] text-[#22060b]">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Кнопка гамбургер для мобилок */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-xl text-[#2A4736] hover:bg-[#EEF4F0] focus:outline-none transition-colors"
                aria-label="Переключить меню"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Выпадающее мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#CBE0D4] bg-white px-4 pt-4 pb-6 space-y-4 max-w-full overflow-x-hidden">
            <nav className="flex flex-col space-y-2 font-medium text-base text-[#2A4736]">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#EEF4F0] transition-colors"
              >
                {t('home')}
              </Link>
              <Link
                href="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#EEF4F0] transition-colors"
              >
                {t('catalog')}
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#EEF4F0] transition-colors"
              >
                {t('about')}
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#EEF4F0] transition-colors"
              >
                {t('contact')}
              </Link>
            </nav>

            <div className="pt-3 border-t border-[#CBE0D4] flex flex-col items-start gap-2 max-w-full overflow-hidden">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('market')}
              </span>
              <MarketSwitcher />
            </div>
          </div>
        )}
      </header>

      {/* Выдвижная корзина */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </>
  );
}