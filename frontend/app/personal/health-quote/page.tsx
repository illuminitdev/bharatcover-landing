import type { Metadata } from 'next';
import HealthQuoteClient from '@/components/health-quote/HealthQuoteClient';

export const metadata: Metadata = {
  title: 'Health Insurance Quote',
  description:
    'Start your Bharat Arogya health application with BharatCover through a guided proposer and nominee journey.',
  openGraph: {
    title: 'BharatCover - Health Quote',
    description:
      'Complete proposer details, nominee details, and review your quote before secure checkout.',
  },
};

export default function HealthQuotePage() {
  return <HealthQuoteClient />;
}
