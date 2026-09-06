import type { CollectionConfig, FieldHook } from 'payload';

// Расширенная функция транслитерации (RU + TR + UZ)
const transliterate = (str: string): string => {
  const charsMap: Record<string, string> = {
    // Кириллица (RU / UZ)
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
    ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
    // Турецкий (TR)
    ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
  };

  return str
    .toLowerCase()
    .split('')
    .map((char) => charsMap[char] || char)
    .join('')
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Хук автоматического формирования slug из названия
const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    // Если пользователь заполнил slug вручную — очищаем его до корректного вида
    if (typeof value === 'string' && value.trim().length > 0) {
      return transliterate(value);
    }

    // Извлекаем заголовок из данных
    let fallbackData = data?.[fallbackField] || originalDoc?.[fallbackField];

    // Учитываем локализацию (localized: true)
    if (typeof fallbackData === 'object' && fallbackData !== null) {
      fallbackData = fallbackData.ru || fallbackData.en || Object.values(fallbackData)[0];
    }

    if (typeof fallbackData === 'string' && fallbackData.length > 0) {
      return transliterate(fallbackData);
    }

    return value;
  };

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    // Заменили 'price' на 'price.rub' для корректного отображения таблицы
    defaultColumns: ['title', 'sku', 'price.rub', 'isAvailable', 'updatedAt'],
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
      localized: true, // Добавлено: позволяет делать языковые URL
      label: 'Slug (ЧПУ для URL)',
      admin: {
        position: 'sidebar',
        description: 'Заполняется автоматически из названия при сохранении',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
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
};