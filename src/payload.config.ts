import { Sliders } from './collections/Sliders';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import path from 'path';
import { fileURLToPath } from 'url';

// Импорты коллекций (без расширения .ts)
import { Products } from './collections/Products';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { Orders } from './collections/Orders';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug, // Указываем коллекцию пользователей для авторизации в админке
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: true,
  }),
  editor: lexicalEditor({}),
  collections: [Products, Categories, Media, Users, Orders, Sliders],
  localization: {
    locales: [
      { code: 'ru', label: 'Русский' },
      { code: 'tr', label: 'Türkçe' },
      { code: 'uz', label: 'Oʻzbekcha' },
      { code: 'pl', label: 'Polski' },
      { code: 'de', label: 'Deutsch' },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || 'AVITA_GOLD_SUPER_SECRET_KEY_2026',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true, // Привязываем хранилище Vercel Blob к коллекции Media
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
});