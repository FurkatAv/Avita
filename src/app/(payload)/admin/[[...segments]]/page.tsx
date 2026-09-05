import type { Metadata } from 'next';
import config from '@payload-config';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap.js';

type Args = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({
    config,
    params: params as any,
    searchParams: searchParams as any,
  });

const Page = async ({ params, searchParams }: Args) =>
  RootPage({
    config,
    params: params as any,
    searchParams: searchParams as any,
    importMap,
  });

export default Page;