import { CollectionConfig } from 'payload';

export const Sliders: CollectionConfig = {
  slug: 'sliders',
  admin: {
    useAsTitle: 'title',
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
      relationTo: 'media', // Ссылка на вашу медиа-библиотеку, куда вы загрузили фото
      required: true,
      label: 'Изображение для прокрутки',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Ссылка (необязательно)',
    },
  ],
};