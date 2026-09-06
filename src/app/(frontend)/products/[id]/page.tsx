import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  let product = null;
  try {
    const payload = await getPayload({ config: configPromise });
    product = await payload.findByID({
      collection: 'products',
      id,
    });
  } catch (error) {
    console.error('Ошибка при загрузке товара:', error);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}