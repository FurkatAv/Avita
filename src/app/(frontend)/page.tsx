// src/app/(frontend)/page.tsx
import config from '@payload-config';
import { getPayload } from 'payload';
import HomeClient from '@/components/HomeClient';

export default async function HomePage() {
  const payload = await getPayload({ config });

  // Запрос с нашей профессиональной сортировкой: витрина первая, остальные по order
  const slidersData = await payload.find({
    collection: 'sliders',
    sort: '-isFeatured,order',
  });

  return <HomeClient sliders={slidersData.docs} />;
}