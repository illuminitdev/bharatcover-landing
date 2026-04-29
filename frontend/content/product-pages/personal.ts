import type { MarketingPageData } from '@/types/product-page';

export const personalPageData: MarketingPageData = {
  seo: {
    title: 'Personal Insurance',
    description:
      'Personal insurance plans — Bharat Arogya health, Bharat Suraksha accident and daily cash. Starting from ₹85/year.',
    openGraphTitle: 'BharatCover — Personal Insurance Plans',
    openGraphDescription: 'Comprehensive health, accident and daily cash cover for individuals and families.',
  },
  sections: [
    {
      type: 'heroSplit',
      headline: 'Personal Insurance Plans',
      sub: 'Comprehensive health, accident and daily cash cover for individuals and families. Starting from just ',
      subHighlight: '₹85/year',
      image: {
        src: 'https://images.unsplash.com/photo-1583946099379-f9c9cb8bc030?auto=format&fit=crop&w=800&q=80',
        alt: 'Indian family enjoying life with insurance protection',
      },
      priceCard: { label: 'Plans Starting', amount: '₹85', period: '/year', planLine: 'Personal Insurance Plans' },
      buttons: [
        { label: 'Get a Free Quote', href: '/personal/contact', variant: 'teal' },
        { label: 'Talk to an Advisor', href: '/personal/contact', variant: 'outline-white' },
      ],
    },
    {
      type: 'sectionIntro',
      label: 'Our Products',
      title: 'Our',
      titleUnderline: 'Personal Plans',
      sub: 'Four products designed for every stage of life',
    },
    {
      type: 'planCards',
      cards: [
        {
          icon: '🏥',
          iconVariant: 'teal',
          insurer: 'Magma General Insurance',
          tagLine: 'Plan 1A · Ages 18–65',
          title: 'Bharat Arogya Health',
          description:
            'Comprehensive health indemnity cover for individuals with hospitalisation, day care and ambulance benefits.',
          benefits: [
            { strong: 'In-Patient Care', text: 'Up to Sum Insured' },
            { strong: 'Pre & Post Hospitalisation', text: '30 / 60 Days' },
            { strong: 'Day Care Cover', text: 'Up to Sum Insured' },
            { strong: 'Ambulance', text: '₹2,000 per claim' },
          ],
          priceRow: { kind: 'from', from: 'From', amount: '₹750', period: '/year', gstNote: 'excl. GST' },
          pills: ['₹1L', '₹2L', '₹3L', '₹5L'],
          cta: { label: 'View Full Details →', href: '/personal/health-insurance', variant: 'outline-navy' },
        },
        {
          icon: '👨‍👩‍👧‍👦',
          iconVariant: 'teal',
          insurer: 'Magma General Insurance',
          tagLine: 'Up to 2A+2C · Ages 18–65',
          title: 'Bharat Arogya Family Floater',
          description:
            'One sum insured shared across the whole family. Covers up to 2 adults and 2 children on a single floater policy.',
          benefits: [
            { strong: 'Shared Floater Sum Insured', text: '' },
            { strong: 'Pre-Existing Disease', text: 'from 12 Months' },
            { strong: 'Room Rent', text: '2% Normal · 4% ICU' },
            { strong: '10% Co-Pay', text: 'on all Claims' },
          ],
          priceRow: { kind: 'full', text: 'From ₹13,559/year', gstNote: 'excl. GST' },
          pills: ['18–50 yrs', '51–65 yrs'],
          cta: { label: 'View Full Details →', href: '/personal/health-insurance', variant: 'outline-navy' },
        },
        {
          badge: { text: 'No Waiting Period', variant: 'green' },
          icon: '⚡',
          iconVariant: 'navy',
          insurer: 'SBI General / Go Digit',
          tagLine: 'Ages 18–65 · No Waiting Period',
          title: 'Bharat Suraksha Accident',
          description:
            'Accidental death and disability cover from Day 1. No waiting period, no medical exam required for cover up to ₹15L.',
          benefits: [
            { strong: 'Accidental Death', text: '100% Sum Insured' },
            { strong: 'Permanent Total Disability (PTD)', text: '' },
            { strong: 'Permanent Partial Disability (PPD)', text: '' },
            { strong: 'Cover from Day 1', text: 'No Waiting Period' },
          ],
          priceRow: { kind: 'from', from: 'From', amount: '₹299', period: '/year', gstNote: 'excl. GST' },
          pills: ['₹1L', '₹5L', '₹10L', '₹15L'],
          note: 'Schools & Colleges: special institutional rates available',
          cta: { label: 'View Full Details →', href: '/personal/accident', variant: 'outline-navy' },
        },
        {
          badge: { text: 'Best Value in Market', variant: 'teal' },
          icon: '💊',
          iconVariant: 'teal',
          insurer: 'SBI General Insurance',
          tagLine: 'Ages 18–65 · Individual',
          title: 'Bharat Suraksha Daily Cash',
          description:
            "Fixed daily cash for every day you're hospitalised. Use it however you need — food, transport, lost income.",
          benefits: [
            { strong: 'Daily Cash', text: 'Up to 30 Days/year' },
            { strong: 'ICU Double Benefit', text: 'Up to 15 Days' },
            { text: 'Benefit paid regardless of actual bills' },
            { text: 'Can stack with any health policy' },
          ],
          priceRow: { kind: 'from', from: 'From', amount: '₹85', period: '/year' },
          pills: ['₹500/day', '₹1,000/day'],
          cta: { label: 'View Full Details →', href: '/personal/accident', variant: 'outline-navy' },
        },
      ],
    },
    {
      type: 'waitingTable',
      label: 'Quick Reference',
      title: 'Waiting Periods',
      titleUnderline: 'at a Glance',
      sub: "Understand what's covered from day one and what has a waiting period.",
      columns: ['Product', 'Initial Waiting', 'Pre-Existing Disease', 'Specific Disease'],
      rows: [
        ['Bharat Arogya Health', '30 Days', '24 Months', '12 Months'],
        ['Bharat Arogya Family Floater', '30 Days', '12 Months', '12 Months'],
        ['Bharat Suraksha Accident', { kind: 'none', text: 'None' }, { kind: 'none', text: 'None' }, { kind: 'none', text: 'None' }],
        ['Bharat Suraksha Daily Cash', '30 Days', '24 Months', '12 Months'],
      ],
    },
    {
      type: 'featureGrid',
      label: 'Why BharatCover',
      title: 'Designed Around',
      titleUnderline: 'Your Life',
      sub: 'Personal insurance that fits your budget, your family, and your needs.',
      tiles: [
        { icon: '💰', title: 'Starts at ₹85/year', description: 'One of the most affordable insurance products in India.' },
        { icon: '🏥', title: '4 Products, 1 Platform', description: 'All your personal cover needs in one place.' },
        { icon: '⚡', title: 'Instant PA Cover', description: 'Accident protection active from Day 1, no medical exam up to ₹15L.' },
        { icon: '👨‍👩‍👧', title: 'Family Floater Option', description: 'Cover your whole family under a single sum insured.' },
        { icon: '🔒', title: 'Trusted Insurers', description: 'Backed by Magma General, SBI General and Go Digit.' },
        { icon: '📞', title: 'Advisor Support', description: 'Dedicated human advisors through every step of claims.' },
      ],
    },
    {
      type: 'steps',
      label: 'Simple Process',
      title: 'How to Get',
      titleUnderline: 'Covered',
      sub: 'Be insured in three easy steps — takes less than 5 minutes.',
      steps: [
        {
          number: '1',
          title: 'Choose a Plan',
          description: 'Browse our four personal plans and select the one that fits your needs and budget.',
        },
        {
          number: '2',
          title: 'Get Your Quote',
          description: 'Enter a few basic details — age, sum insured, and family composition.',
        },
        {
          number: '3',
          title: 'Policy Issued',
          description: 'Pay securely online and receive your policy document by email within minutes.',
        },
      ],
    },
    {
      type: 'faq',
      label: 'FAQ',
      title: 'Common',
      titleUnderline: 'Questions',
      sub: 'Everything you need to know before you buy.',
      items: [
        {
          question: 'What is the minimum sum insured I can buy?',
          answer:
            'For Bharat Arogya Health, the minimum sum insured is ₹1 Lakh. For Bharat Suraksha Accident, you can start from ₹1 Lakh of accidental cover.',
        },
        {
          question: 'Can I have multiple personal plans at the same time?',
          answer:
            'Yes. In fact, we recommend combining plans for maximum protection — health, daily cash and accident cover together.',
        },
        {
          question: 'Is there a waiting period for accident cover?',
          answer:
            'No. Bharat Suraksha Accident has zero waiting period. Cover is active from the moment your policy start date begins.',
        },
        {
          question: 'What is co-pay and how does it affect my claim?',
          answer:
            'Co-pay means you share a fixed percentage of every claim with the insurer. The Family Floater has a 10% co-pay on all claims.',
        },
        {
          question: 'Can I add family members later to the floater plan?',
          answer:
            'New family members can typically be added at the time of policy renewal. Mid-term additions may be allowed for newborns.',
        },
      ],
    },
    {
      type: 'ctaBand',
      title: 'Get Your Personal Cover Today',
      sub: 'Compare plans, get instant quotes, and be covered in minutes.',
      buttons: [
        { label: 'Get Quote Now', href: '/personal/contact', variant: 'teal' },
        { label: 'Talk to an Advisor', href: '/personal/contact', variant: 'outline-white' },
      ],
    },
  ],
};
