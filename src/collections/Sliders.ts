import type { CollectionConfig } from 'payload';

export const Sliders: CollectionConfig = {
  slug: 'sliders',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['image', 'title', 'isFeatured', 'order', 'updatedAt'],
  },
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        if (data?.isFeatured) {
          await req.payload.update({
            collection: 'sliders',
            where: {
              and: [
                { isFeatured: { equals: true } },
                ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
              ],
            },
            data: {
              isFeatured: false,
            },
          });
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название слайда',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Изображение для прокрутки',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Ссылка (необязательно)',
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Главный слайд (Витрина)',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Автоматически станет первым в карусели',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок сортировки',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Меньше число — раньше в списке (для остальных)',
      },
    },
  ],
};