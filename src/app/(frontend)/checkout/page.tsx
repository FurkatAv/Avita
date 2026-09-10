'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Словари переводов для 6 языков (без звонков менеджера)
const translations: Record<string, Record<string, string>> = {
  ru: {
    checkoutTitle: 'Оформление и оплата заказа',
    recipientData: 'Данные получателя и доставки',
    fullName: 'ФИО получателя *',
    fullNamePlaceholder: 'Иван Иванов',
    phone: 'Номер телефона *',
    phonePlaceholder: '+7 999 000-00-00',
    email: 'E-mail (для получения чек-квитанции) *',
    emailPlaceholder: 'example@mail.com',
    address: 'Адрес доставки *',
    addressPlaceholder: 'Город, улица, дом, квартира',
    paymentMethod: 'Способ оплаты',
    paymentCard: 'Онлайн-оплата картой (Мгновенная отправка)',
    comment: 'Комментарий к заказу',
    commentPlaceholder: 'Код подьезда, удобное время...',
    confirmBtn: 'Перейти к оплате',
    yourOrder: 'Ваш заказ',
    totalToPay: 'Итого к оплате:',
    backToShop: '← На главную',
    emptyCart: 'Ваша корзина пуста.',
    goToShop: 'Перейти к покупкам',
    orderSuccessTitle: 'Заказ успешно оплачен и принят!',
    orderSuccessDesc: 'Спасибо, {name}! Ваш заказ передан на склад и готовится к автоматической отправке. Трек-номер и чек отправлены на {email} и SMS на {phone}.',
    backToStore: 'Вернуться в магазин',
    qty: 'Кол-во:',
    requiredAlert: 'Пожалуйста, заполните обязательные поля: Имя, Телефон, Email и Адрес',
  },
  uz: {
    checkoutTitle: 'Buyurtmani rasmiylashtirish va to\'lov',
    recipientData: 'Qabul qiluvchi va yetkazib berish ma\'lumotlari',
    fullName: 'F.I.SH. *',
    fullNamePlaceholder: 'Ism Familiya',
    phone: 'Telefon raqami *',
    phonePlaceholder: '+998 90 123-45-67',
    email: 'E-mail (chek olish uchun) *',
    emailPlaceholder: 'example@mail.com',
    address: 'Yetkazib berish manzili *',
    addressPlaceholder: 'Shahar, ko\'cha, uy, xonadon',
    paymentMethod: 'To\'lov usuli',
    paymentCard: 'Karta orqali onlayn to\'lov (Zudlik bilan yuborish)',
    comment: 'Buyurtmaga izoh',
    commentPlaceholder: 'Qo\'shimcha ko\'rsatmalar...',
    confirmBtn: 'To\'lovga o\'tish',
    yourOrder: 'Sizning buyurtmangiz',
    totalToPay: 'Jami to\'lov:',
    backToShop: '← Bosh sahifaga',
    emptyCart: 'Savat bo\'sh.',
    goToShop: 'Xarid qilishga o\'tish',
    orderSuccessTitle: 'Buyurtma to\'landi va qabul qilindi!',
    orderSuccessDesc: 'Rahmat, {name}! Buyurtmangiz omborga topshirildi va avtomatik ravishda yuborishga tayyorlanmoqda. Kuzatuv raqami (trek-kod) {email} va SMS orqali {phone} raqamiga yuborildi.',
    backToStore: 'Do\'konga qaytish',
    qty: 'Soni:',
    requiredAlert: 'Iltimos, majburiy maydonlarni to\'ldiring: Ism, Telefon, Email va Manzil',
  },
  en: {
    checkoutTitle: 'Checkout & Payment',
    recipientData: 'Recipient & Delivery Details',
    fullName: 'Full Name *',
    fullNamePlaceholder: 'John Doe',
    phone: 'Phone Number *',
    phonePlaceholder: '+1 234 567-89-00',
    email: 'E-mail (for receipt) *',
    emailPlaceholder: 'example@mail.com',
    address: 'Delivery Address *',
    addressPlaceholder: 'City, street, house, apartment',
    paymentMethod: 'Payment Method',
    paymentCard: 'Online Card Payment (Instant Dispatch)',
    comment: 'Order Comment',
    commentPlaceholder: 'Delivery instructions...',
    confirmBtn: 'Proceed to Payment',
    yourOrder: 'Your Order',
    totalToPay: 'Total Amount:',
    backToShop: '← Back to Store',
    emptyCart: 'Your cart is empty.',
    goToShop: 'Go Shopping',
    orderSuccessTitle: 'Order Paid & Confirmed!',
    orderSuccessDesc: 'Thank you, {name}! Your order is sent to the warehouse for automatic fulfillment. Tracking details have been sent to {email} and {phone}.',
    backToStore: 'Return to Store',
    qty: 'Qty:',
    requiredAlert: 'Please fill in required fields: Name, Phone, Email, and Address',
  },
  de: {
    checkoutTitle: 'Kasse & Zahlung',
    recipientData: 'Empfänger- & Lieferdaten',
    fullName: 'Vollständiger Name *',
    fullNamePlaceholder: 'Max Mustermann',
    phone: 'Telefonnummer *',
    phonePlaceholder: '+49 123 456789',
    email: 'E-Mail (für Quittung) *',
    emailPlaceholder: 'beispiel@mail.com',
    address: 'Lieferadresse *',
    addressPlaceholder: 'Stadt, Straße, Hausnummer, Wohnung',
    paymentMethod: 'Zahlungsart',
    paymentCard: 'Online-Kartenzahlung (Sofortiger Versand)',
    comment: 'Bestellkommentar',
    commentPlaceholder: 'Zusätzliche Hinweise...',
    confirmBtn: 'Weiter zur Zahlung',
    yourOrder: 'Ihre Bestellung',
    totalToPay: 'Gesamtsumme:',
    backToShop: '← Zurück zum Shop',
    emptyCart: 'Ihr Warenkorb ist leer.',
    goToShop: 'Zum Shop',
    orderSuccessTitle: 'Bestellung bezahlt & bestätigt!',
    orderSuccessDesc: 'Vielen Dank, {name}! Ihre Bestellung wurde zur automatischen Bearbeitung an das Lager übergeben. Die Sendungsverfolgung wurde an {email} und {phone} gesendet.',
    backToStore: 'Zurück zum Shop',
    qty: 'Menge:',
    requiredAlert: 'Bitte füllen Sie die Pflichtfelder aus: Name, Telefon, E-Mail und Adresse',
  },
  tr: {
    checkoutTitle: 'Ödeme ve Teslimat',
    recipientData: 'Alıcı ve Teslimat Bilgileri',
    fullName: 'Ad Soyad *',
    fullNamePlaceholder: 'Ahmet Yılmaz',
    phone: 'Telefon Numarası *',
    phonePlaceholder: '+90 555 123 45 67',
    email: 'E-posta (Makbuz için) *',
    emailPlaceholder: 'ornek@mail.com',
    address: 'Teslimat Adresi *',
    addressPlaceholder: 'Şehir, sokak, bina no, daire',
    paymentMethod: 'Ödeme Yöntemi',
    paymentCard: 'Online Kart ile Ödeme (Anında Gönderim)',
    comment: 'Sipariş Notu',
    commentPlaceholder: 'Teslimat notları...',
    confirmBtn: 'Ödemeye Geç',
    yourOrder: 'Siparişiniz',
    totalToPay: 'Toplam Tutar:',
    backToShop: '← Ana Sayfaya Dön',
    emptyCart: 'Sepetiniz boş.',
    goToShop: 'Alışverişe Başla',
    orderSuccessTitle: 'Sipariş Onaylandı ve Ödendi!',
    orderSuccessDesc: 'Teşekkürler, {name}! Siparişiniz otomatik gönderim için depoya iletildi. Kargo takip bilgisi {email} adresinize ve {phone} numaranıza SMS olarak gönderildi.',
    backToStore: 'Mağazaya Dön',
    qty: 'Adet:',
    requiredAlert: 'Lütfen zorunlu alanları doldurun: Ad Soyad, Telefon, E-posta ve Adres',
  },
  pl: {
    checkoutTitle: 'Kasa i Płatność',
    recipientData: 'Dane odbiorcy i dostawy',
    fullName: 'Imię i nazwisko *',
    fullNamePlaceholder: 'Jan Kowalski',
    phone: 'Numer telefonu *',
    phonePlaceholder: '+48 123 456 789',
    email: 'E-mail (do rachunku) *',
    emailPlaceholder: 'przyklad@mail.com',
    address: 'Adres dostawy *',
    addressPlaceholder: 'Miasto, ulica, numer domu, mieszkanie',
    paymentMethod: 'Metoda płatności',
    paymentCard: 'Płatność kartą online (Natychmiastowa wysyłka)',
    comment: 'Komentarz do zamówienia',
    commentPlaceholder: 'Uwagi dotyczące dostawy...',
    confirmBtn: 'Przejdź do płatności',
    yourOrder: 'Twoje zamówienie',
    totalToPay: 'Łącznie do zapłaty:',
    backToShop: '← Powrót do sklepu',
    emptyCart: 'Twój koszyk jest pusty.',
    goToShop: 'Przejdź do sklepu',
    orderSuccessTitle: 'Zamówienie opłacone i przyjęte!',
    orderSuccessDesc: 'Dziękujemy, {name}! Twoje zamówienie zostało przekazane do magazynu w celu automatycznej wysyłki. Numer śledzenia wysłano na {email} oraz SMS-em na {phone}.',
    backToStore: 'Powrót do sklepu',
    qty: 'Ilość:',
    requiredAlert: 'Proszę wypełnić wymagane pola: Imię i nazwisko, Telefon, E-mail oraz Adres',
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState<Array<{ product: any; quantity: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [lang, setLang] = useState<string>('ru');
  const [currency, setCurrency] = useState<string>('usd');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
    paymentMethod: 'card_online',
  });

  useEffect(() => {
    setIsMounted(true);
    
    try {
      const savedCart = localStorage.getItem('avita_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    } catch (e) {
      console.error('Ошибка при загрузке корзины:', e);
    }

    const loadSettings = () => {
      const savedLang = (
        localStorage.getItem('avita_lang') || 
        localStorage.getItem('lang') || 
        localStorage.getItem('language') || 
        localStorage.getItem('NEXT_LOCALE') || 
        'ru'
      ).toLowerCase();

      const savedCurrency = (
        localStorage.getItem('avita_currency') || 
        localStorage.getItem('currency') || 
        localStorage.getItem('selectedCurrency') || 
        'usd'
      ).toLowerCase();

      setLang(savedLang);
      setCurrency(savedCurrency);
    };

    loadSettings();

    const handleStorageChange = () => loadSettings();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!isMounted) return null;

  const t = (key: string) => translations[lang]?.[key] || translations['ru'][key] || key;

  const getProductTitle = (product: any): string => {
    if (!product?.title) return '';
    if (typeof product.title === 'string') return product.title;
    if (typeof product.title === 'object') {
      return product.title[lang] || product.title.ru || product.title.en || Object.values(product.title)[0] || '';
    }
    return '';
  };

  const getProductPrice = (product: any): number => {
    if (!product?.price) return 0;
    if (typeof product.price === 'number') return product.price;
    if (typeof product.price === 'object') {
      const p = product.price;
      const currKey = currency.toLowerCase();
      if (p[currKey] !== undefined) return Number(p[currKey]);
      return Number(p.usd || p.eur || p.rub || p.uzs || p.try || p.pln || Object.values(p)[0] || 0);
    }
    return 0;
  };

  const getCurrencySymbol = (): string => {
    const c = currency.toLowerCase();
    if (c === 'usd' || c === '$') return '$';
    if (c === 'eur' || c === '€') return '€';
    if (c === 'rub' || c === '₽') return '₽';
    if (c === 'uzs' || c === 'so\'m' || c === 'som' || c === 'сум') return 'so\'m';
    if (c === 'try' || c === 'tl' || c === '₺') return '₺';
    if (c === 'pln' || c === 'zł') return 'zł';
    return c.toUpperCase();
  };

  const formatPrice = (amount: number): string => {
    const symbol = getCurrencySymbol();
    if (symbol === '$' || symbol === '€' || symbol === '₺') {
      return `${symbol}${amount.toLocaleString()}`;
    }
    return `${amount.toLocaleString()} ${symbol}`;
  };

  const getImageUrl = (product: any): string => {
    const firstImg = product.images?.[0]?.image;
    if (typeof firstImg === 'string') return firstImg;
    if (firstImg?.url) return firstImg.url;
    return '/placeholder.jpg';
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + getProductPrice(item.product) * item.quantity;
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      alert(t('requiredAlert'));
      return;
    }

    setIsLoading(true);

    try {
      // Здесь вызывается ваш API для создания платежного сеанса (Stripe / Payme / Click / ЮKassa)
      /* 
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: formData, items: cartItems, currency }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Перенаправление на страницу оплаты
        return;
      }
      */

      // Имитация мгновенной авто-обработки
      setTimeout(() => {
        localStorage.removeItem('avita_cart');
        setIsLoading(false);
        setIsSubmitted(true);
      }, 1000);

    } catch (error) {
      console.error('Ошибка при обработке оплаты:', error);
      setIsLoading(false);
    }
  };

  // Экран успешной оплаты и автоматической обработки
  if (isSubmitted) {
    const successMsg = t('orderSuccessDesc')
      .replace('{name}', formData.name)
      .replace('{email}', formData.email)
      .replace('{phone}', formData.phone);

    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#CBE0D4] p-6 text-center shadow-lg">
          <div className="w-14 h-14 bg-[#EEF4F0] text-[#376C4A] rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black">
            ✓
          </div>
          <h1 className="text-xl font-black text-[#2A4736] mb-2">{t('orderSuccessTitle')}</h1>
          <p className="text-gray-600 text-xs leading-relaxed mb-5">{successMsg}</p>
          <Link
            href="/"
            className="block w-full bg-[#376C4A] hover:bg-[#2A4736] text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-center text-xs"
          >
            {t('backToStore')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2A4736] pb-6">
      <header className="bg-white border-b border-[#CBE0D4] py-2.5 px-4 sm:px-8 mb-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex flex-col items-start">
            <div className="text-base font-black tracking-wider leading-none flex items-center gap-1">
              <span className="text-red-600">AVITA</span>
              <span className="text-[#D4AF37]">GOLD</span>
            </div>
            <span className="text-[8px] font-bold text-red-600 tracking-widest uppercase">
              EXCLUSIVE
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-[#376C4A] hover:underline flex items-center gap-1"
          >
            {t('backToShop')}
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-black mb-3 text-[#2A4736]">{t('checkoutTitle')}</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#CBE0D4] p-8 text-center shadow-sm">
            <p className="text-gray-500 text-sm mb-4">{t('emptyCart')}</p>
            <Link
              href="/"
              className="inline-block bg-[#376C4A] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-[#2A4736] transition-all"
            >
              {t('goToShop')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#CBE0D4] p-4 sm:p-5 shadow-sm">
              <h2 className="text-base font-bold mb-3 text-[#2A4736] border-b border-[#EEF4F0] pb-2">
                {t('recipientData')}
              </h2>

              <form onSubmit={handleSubmitOrder} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    {t('fullName')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#376C4A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      {t('phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t('phonePlaceholder')}
                      className="w-full bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#376C4A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('emailPlaceholder')}
                      className="w-full bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#376C4A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    {t('address')}
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t('addressPlaceholder')}
                    className="w-full bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#376C4A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    {t('paymentMethod')}
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#376C4A] cursor-pointer"
                  >
                    <option value="card_online">{t('paymentCard')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    {t('comment')}
                  </label>
                  <textarea
                    name="comment"
                    rows={2}
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder={t('commentPlaceholder')}
                    className="w-full bg-[#FAF9F6] border border-[#CBE0D4] text-[#2A4736] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#376C4A] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#376C4A] hover:bg-[#2A4736] text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md mt-2 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? '...' : t('confirmBtn')}
                </button>
              </form>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-[#CBE0D4] p-4 sm:p-5 shadow-sm sticky top-16">
                <h2 className="text-base font-bold mb-3 text-[#2A4736] border-b border-[#EEF4F0] pb-2">
                  {t('yourOrder')} ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                </h2>

                <div className="divide-y divide-[#EEF4F0] max-h-56 overflow-y-auto mb-3 pr-1">
                  {cartItems.map((item) => {
                    const title = getProductTitle(item.product);
                    const price = getProductPrice(item.product);
                    const imgUrl = getImageUrl(item.product);

                    return (
                      <div key={item.product.id} className="py-2 flex items-center gap-2.5">
                        <div className="relative w-10 h-10 bg-[#FAF9F6] border border-[#CBE0D4] rounded-lg shrink-0 overflow-hidden p-0.5">
                          <Image src={imgUrl} alt={title} fill unoptimized className="object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-bold text-[#2A4736] line-clamp-1">{title}</h4>
                          <p className="text-[10px] text-gray-500">{t('qty')} {item.quantity}</p>
                        </div>
                        <span className="text-xs font-black text-[#376C4A] shrink-0">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#CBE0D4] pt-3">
                  <div className="flex justify-between items-center text-sm font-black text-[#2A4736]">
                    <span>{t('totalToPay')}</span>
                    <span className="text-lg text-[#376C4A]">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}