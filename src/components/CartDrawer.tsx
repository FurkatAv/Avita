'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../context/CurrencyContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem?: (id: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const router = useRouter();
  const { formatPrice } = useCurrency();

  // Блокировка скролла страницы при открытой корзине
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Переход к оформлению заказа вместо стандартного alert
  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end">
      {/* Затемнение фона */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Выдвижная панель */}
      <div className="relative w-full max-w-[420px] bg-white text-[#2A4736] h-full flex flex-col z-[100000] shadow-2xl">
        
        {/* Шапка корзины */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#2A4736]">Корзина</h2>
            <span className="bg-[#2A4736] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-400 hover:text-[#2A4736] text-xl transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {/* Список товаров */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <p className="text-base font-semibold text-gray-400">Ваша корзина пуста</p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 items-center bg-[#F8FAFC] p-3.5 rounded-2xl border border-gray-100"
              >
                {/* Изображение */}
                <div className="w-16 h-16 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 p-1 flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>

                {/* Инфо и управление */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                    {onRemoveItem && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-300 hover:text-red-500 text-xs transition-colors p-0.5"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="text-xs font-bold text-[#2A4736] mt-1">
                    {formatPrice(item.price)}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-0.5 shadow-xs">
                      <button 
                        type="button" 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-gray-500 hover:text-[#2A4736] text-xs font-bold cursor-pointer px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-gray-500 hover:text-[#2A4736] text-xs font-bold cursor-pointer px-1"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-gray-700">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Подвал с итогом и кнопкой */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white space-y-4">
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-500 font-medium">Итого:</span>
              <span className="text-[#2A4736] text-xl font-black">{formatPrice(subtotal)}</span>
            </div>

            <button 
              type="button"
              onClick={handleCheckout}
              className="w-full bg-[#2A4736] hover:bg-[#1E3327] text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm shadow-md"
            >
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}