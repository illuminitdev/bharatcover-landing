import type { Metadata } from 'next';
import { businessPageData } from '@/content/product-pages/business';
import { ProductMarketingPage } from '@/components/product-pages/ProductMarketingPage';

const { seo } = businessPageData;

export const metadata: Metadata = {
  title: 'Business Group Plans',
  description: seo.description,
  openGraph: {
    title: 'BharatCover — Business group plans',
    description: seo.openGraphDescription ?? seo.description,
  },
};

export default function BusinessGroupPlansPage() {
  return <ProductMarketingPage sections={businessPageData.sections} />;
}
