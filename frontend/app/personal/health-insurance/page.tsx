import type { Metadata } from 'next';
import { healthInsurancePageData } from '@/content/product-pages/health-insurance';
import { ProductMarketingPage } from '@/components/product-pages/ProductMarketingPage';

const { seo } = healthInsurancePageData;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.openGraphTitle ?? seo.title,
    description: seo.openGraphDescription ?? seo.description,
  },
};

export default function HealthInsurancePage() {
  return <ProductMarketingPage sections={healthInsurancePageData.sections} />;
}
