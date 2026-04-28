import type { Metadata } from 'next';
import { businessPageData } from '@/content/product-pages/business';
import { ProductMarketingPage } from '@/components/product-pages/ProductMarketingPage';

const { seo } = businessPageData;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.openGraphTitle ?? seo.title,
    description: seo.openGraphDescription ?? seo.description,
  },
};

export default function BusinessPage() {
  return <ProductMarketingPage sections={businessPageData.sections} />;
}
