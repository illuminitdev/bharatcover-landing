import type { Metadata } from 'next';
import { contactPageData } from '@/content/product-pages/contact';
import { ContactPageView } from '@/components/product-pages/ContactPageView';

const { seo } = contactPageData;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.openGraphTitle ?? seo.title,
    description: seo.openGraphDescription ?? seo.description,
  },
};

export default function PersonalContactPage() {
  return <ContactPageView data={contactPageData} />;
}
