import config from '@payload-config';
import { getPayload } from 'payload';
import HomeClient from '@/components/HomeClient';

// Отключаем кэширование, чтобы изменения в CMS сразу появлялись на сайте
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const payload = await getPayload({ config });

  // Запрос с сортировкой, глубиной для загрузки картинок и актуальными данными
  const slidersData = await payload.find({
    collection: 'sliders',
    sort: '-isFeatured,order',
    depth: 1, // Обязательно, чтобы получить полноценные объекты картинок, а не просто ID
  });

  return <HomeClient sliders={slidersData.docs} />;
}