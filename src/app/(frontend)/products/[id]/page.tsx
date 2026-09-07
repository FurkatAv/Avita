import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string; locale: string }>; // Добавили locale в типы
}

export default async function ProductPage({ params }: PageProps) {
  const { id, locale } = await params; // Достаем и id, и текущий язык из URL

  let product = null;
  try {
    const payload = await getPayload({ config: configPromise });
    product = await payload.findByID({
      collection: 'products',
      id,
      locale: locale as any, // <--- Передаем текущий язык в Payload
      fallbackLocale: 'ru',  // <--- Запасной язык, если перевод не заполнен
    });
  } catch (error) {
    console.error('Ошибка при загрузке товара:', error);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}