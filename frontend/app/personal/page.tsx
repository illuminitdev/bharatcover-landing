import type { Metadata } from 'next';
import { personalPageData } from '@/content/product-pages/personal';
import { ProductMarketingPage } from '@/components/product-pages/ProductMarketingPage';

const { seo } = personalPageData;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.openGraphTitle ?? seo.title,
    description: seo.openGraphDescription ?? seo.description,
  },
};

export default function PersonalPage() {
  return <ProductMarketingPage sections={personalPageData.sections} />;
}
