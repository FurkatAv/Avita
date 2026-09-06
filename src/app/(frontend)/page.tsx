import config from '@payload-config';
import { getPayload } from 'payload';
import HomeClient from '@/components/HomeClient';

// Отключаем кэширование, чтобы изменения в CMS сразу появлялись на сайте
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const payload = await getPayload({ config });

  // 1. Загрузка слайдеров
  const slidersData = await payload.find({
    collection: 'sliders',
    sort: '-isFeatured,order',
    depth: 1,
  });

  // 2. Загрузка товаров из Payload CMS
  const productsData = await payload.find({
    collection: 'products',
    sort: '-createdAt',
    depth: 2, // depth: 2 нужен для массивов изображений товара
    limit: 100,
  });

  // Передаем и слайдеры, и реальные товары в компонент
  return (
    <HomeClient 
      sliders={slidersData.docs} 
      products={productsData.docs} 
    />
  );
}