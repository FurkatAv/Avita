import type { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    {
      name: 'total',
      type: 'number',
    },
  ],
};