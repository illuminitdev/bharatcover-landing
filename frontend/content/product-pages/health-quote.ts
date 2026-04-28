import type { MarketingPageData } from '@/types/product-page';

export const healthQuotePageData: MarketingPageData = {
  seo: {
    title: 'Health Insurance Quote',
    description:
      'Start your Bharat Arogya health application with BharatCover — proposer details, members and review in guided steps, or speak to an advisor.',
    openGraphTitle: 'BharatCover — Health Quote',
    openGraphDescription: 'Bharat Arogya Individual quote flow and advisor support.',
  },
  sections: [
    {
      type: 'healthQuoteHero',
      progressPercent: 33,
      planTag: 'Bharat Arogya Individual',
      title: 'Bharat Arogya',
      titleEm: 'Individual Plan',
      description:
        'Comprehensive health indemnity cover with cashless hospitalisation, day care, pre & post-hospitalisation benefits.',
      chips: ['🏥 Cashless Hospitals', '🗓️ 1-Year Tenure', '⚡ Instant Policy', '💰 SI: ₹3,00,000'],
      premLabel: 'Annual Premium',
      premAmount: '₹1,250',
      premSub: 'excl. 18% GST',
    },
    {
      type: 'healthQuoteSteps',
      steps: [
        { num: '1', label: 'Proposer Details', active: true },
        { num: '2', label: 'Member Details' },
        { num: '3', label: 'Review & Confirm' },
      ],
    },
    {
      type: 'infoCallout',
      title: 'Complete your application with BharatCover',
      body:
        'The full multi-step health proposal form is being moved into our secure React journey. For now, request a callback and our team will capture your details and issue your policy with the same benefits as the legacy flow — or continue with an instant Personal Accident quote online.',
      links: [
        { label: '📞 Request callback', href: '/personal/contact', variant: 'teal' },
        { label: '🏥 View Bharat Arogya plans', href: '/personal/health-insurance', variant: 'outline-navy' },
        { label: '🛡️ Instant PA quote', href: '/sales', variant: 'outline-navy' },
      ],
    },
  ],
};
