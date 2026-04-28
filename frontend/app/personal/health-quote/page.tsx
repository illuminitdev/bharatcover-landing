import type { Metadata } from 'next';
import { healthQuotePageData } from '@/content/product-pages/health-quote';
import { ProductMarketingPage } from '@/components/product-pages/ProductMarketingPage';

const { seo } = healthQuotePageData;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.openGraphTitle ?? seo.title,
    description: seo.openGraphDescription ?? seo.description,
  },
};

export default function HealthQuotePage() {
  return <ProductMarketingPage sections={healthQuotePageData.sections} />;
}
