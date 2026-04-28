import type { Metadata } from 'next';
import { accidentPageData } from '@/content/product-pages/accident';
import { ProductMarketingPage } from '@/components/product-pages/ProductMarketingPage';

const { seo } = accidentPageData;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.openGraphTitle ?? seo.title,
    description: seo.openGraphDescription ?? seo.description,
  },
};

export default function AccidentPage() {
  return <ProductMarketingPage sections={accidentPageData.sections} />;
}
