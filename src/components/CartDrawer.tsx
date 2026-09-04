'use client';

import { useCurrency } from '../context/CurrencyContext';

interface CartItem {
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
}

export default function CartDrawer({ isOpen, onClose, items, onUpdateQuantity }: CartDrawerProps) {
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div 
      style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', justifyContent: 'flex-end' }}
    >
      {/* Затемнение фона */}
      <div 
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Выдвижная панель */}
      <div 
        style={{ position: 'relative', width: '100%', maxWidth: '420px', backgroundColor: '#22060b', color: 'white', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 100000, borderLeft: '1px solid rgba(212,175,55,0.4)', padding: '24px', boxShadow: '-10px 0 30px rgba(0,0,0,0.8)' }}
      >
        <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-4 mb-6">
          <h2 className="text-xl font-bold text-[#d4af37]">Корзина</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-white hover:text-[#d4af37] text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Список товаров */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-[#d0d0d0] mt-10">Ваша корзина пуста</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-[#3d0c15]/50 p-3 rounded-lg border border-[#d4af37]/20">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{item.name}</h4>
                  <div className="text-xs text-[#d4af37] mt-1">{formatPrice(item.price)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      type="button" 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="px-2 bg-black/40 rounded border border-[#d4af37]/30 text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs">{item.quantity}</span>
                    <button 
                      type="button" 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="px-2 bg-black/40 rounded border border-[#d4af37]/30 text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Итог и кнопка заказа */}
        {items.length > 0 && (
          <div className="border-t border-[#d4af37]/20 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4 text-lg font-bold">
              <span>Итого:</span>
              <span className="text-[#d4af37]">{formatPrice(subtotal)}</span>
            </div>
            <button 
              type="button"
              onClick={() => alert('Переход к оформлению заказа!')}
              className="w-full bg-[#d4af37] text-[#22060b] font-bold py-3 rounded-lg hover:bg-[#f3e5ab] transition-colors cursor-pointer"
            >
              ОФОРМИТЬ ЗАКАЗ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}