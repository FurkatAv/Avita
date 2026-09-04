import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sku', 'price', 'isAvailable', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Название товара',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug (ЧПУ для URL)',
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      label: 'Артикул (SKU)',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Описание товара',
    },
    {
      name: 'price',
      type: 'group',
      label: 'Мультивалютная цена',
      fields: [
        {
          name: 'baseCurrency',
          type: 'select',
          required: true,
          defaultValue: 'RUB',
          label: 'Базовая валюта',
          options: [
            { label: 'Российский рубль (RUB ₽)', value: 'RUB' },
            { label: 'Доллар США (USD $)', value: 'USD' },
            { label: 'Евро (EUR €)', value: 'EUR' },
            { label: 'Турецкая лира (TRY ₺)', value: 'TRY' },
            { label: 'Узбекский сум (UZS)', value: 'UZS' },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'rub',
              type: 'number',
              label: 'Цена в RUB (₽)',
              min: 0,
              admin: { step: 0.01 },
            },
            {
              name: 'usd',
              type: 'number',
              label: 'Цена в USD ($)',
              min: 0,
              admin: { step: 0.01 },
            },
            {
              name: 'eur',
              type: 'number',
              label: 'Цена в EUR (€)',
              min: 0,
              admin: { step: 0.01 },
            },
            {
              name: 'try',
              type: 'number',
              label: 'Цена в TRY (₺)',
              min: 0,
              admin: { step: 0.01 },
            },
            {
              name: 'uzs',
              type: 'number',
              label: 'Цена в UZS (сум)',
              min: 0,
              admin: { step: 1 },
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Категории',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Изображения товара',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      defaultValue: true,
      label: 'В наличии',
    },
  ],
}