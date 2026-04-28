import type { Metadata } from 'next';
import { contactPageData } from '@/content/product-pages/contact';
import { ContactPageView } from '@/components/product-pages/ContactPageView';

const { seo } = contactPageData;

export const metadata: Metadata = {
  title: 'Business — Contact',
  description: seo.description,
  openGraph: {
    title: 'BharatCover — Business contact & quote',
    description: seo.openGraphDescription ?? seo.description,
  },
};

export default function BusinessContactPage() {
  return <ContactPageView data={contactPageData} />;
}
