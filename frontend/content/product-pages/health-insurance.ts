import type { MarketingPageData, MarketingSection } from '@/types/product-page';

const individualCoverage: MarketingSection[] = [
  {
    type: 'coverageCard',
    icon: '✅',
    iconVariant: 'sage',
    title: "What's Covered",
    subtitle: 'Core benefits included in the Bharat Arogya Individual plan',
    items: [
      {
        title: 'In-Patient Hospitalisation',
        description:
          'Up to Sum Insured for room, nursing, surgery, and all in-hospital medical expenses.',
      },
      {
        title: 'Pre-Hospitalisation',
        description: '30 days of medical expenses incurred before admission — diagnostics, consultations & medicines.',
      },
      {
        title: 'Post-Hospitalisation',
        description: '60 days of follow-up care after discharge — medicines, physiotherapy & doctor visits.',
      },
      {
        title: 'Day Care Procedures',
        description:
          'Over 540 procedures covered — no 24-hour admission required. Cataract, dialysis, chemotherapy & more.',
      },
      {
        title: 'Ambulance Cover',
        description: 'Up to ₹2,000 per hospitalisation for emergency ambulance charges to the nearest hospital.',
      },
      {
        title: 'Room Rent',
        description: '2% of SI/day for Normal ward; 4% of SI/day for ICU. Proportionate deduction applies if exceeded.',
      },
      {
        title: 'Co-Pay',
        description:
          '10% co-payment applicable on all claims. You bear 10% of admissible claim amount; insurer covers the remaining 90%.',
        fullWidth: true,
      },
    ],
  },
  {
    type: 'waitGrid',
    icon: '⏳',
    iconVariant: 'indigo',
    title: 'Waiting Periods',
    subtitle: 'Standard waiting periods applicable under this plan',
    items: [
      { icon: '📅', label: 'Initial Waiting Period', period: '30 Days' },
      { icon: '🩺', label: 'Pre-Existing Disease (PED)', period: '24 Months' },
      { icon: '🏥', label: 'Specific Disease / Procedure', period: '12 Months' },
      { icon: '⚡', label: 'Accidents', period: 'None — Day 1', noWait: true },
    ],
  },
  {
    type: 'premiumTables',
    icon: '₹',
    iconVariant: 'indigo',
    title: 'Premium at a Glance',
    subtitle: 'Annual premium for individuals aged 18–65 years',
    anchorId: 'premium-table',
    tables: [
      {
        headers: ['Sum Insured', 'Base Premium', 'With GST (18%)'],
        rows: [
          ['₹1,00,000', '₹750 / yr', '₹885 / yr'],
          ['₹2,00,000', '₹1,050 / yr', '₹1,239 / yr'],
          ['₹3,00,000', '₹1,250 / yr', '₹1,475 / yr'],
          ['₹5,00,000', '₹2,050 / yr', '₹2,419 / yr'],
        ],
        note:
          '⚡ GST Note: GST exemption on individual health plans was announced in Sep 2025. Check the latest applicable rates with your advisor before purchase.',
      },
    ],
  },
  {
    type: 'faq',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: "What does 'co-pay' mean in this plan?",
        answer:
          'Co-pay (or co-payment) means you share a fixed percentage of the admissible claim with the insurer. Under this plan, you pay 10% of the admissible claim amount while the insurance company pays the remaining 90%.',
      },
      {
        question: 'Which hospitals are in the cashless network?',
        answer:
          'Magma General Insurance has empanelled 10,000+ hospitals across India for cashless treatment. You can search for network hospitals on the insurer website or through the BharatCover portal.',
      },
      {
        question: 'Is day care treatment covered?',
        answer:
          'Yes. The Bharat Arogya Individual plan covers over 540 day care procedures that do not require 24-hour hospitalisation due to advances in medical technology.',
      },
      {
        question: 'What is room rent capping and how does it affect my claim?',
        answer:
          'Room rent capping limits the amount the insurer pays per day for your hospital room. Under this plan, the limit is 2% of the Sum Insured per day for a normal ward and 4% for ICU.',
      },
      {
        question: 'Can I port my existing health policy to Bharat Arogya?',
        answer:
          'Yes, portability is available as per IRDAI guidelines. You can port your existing health insurance policy to Bharat Arogya Individual and retain the waiting period credits accumulated under your previous policy.',
      },
    ],
  },
];

const floaterCoverage: MarketingSection[] = [
  {
    type: 'coverageCard',
    icon: '✅',
    iconVariant: 'sage',
    title: "What's Covered",
    subtitle: 'Sum Insured is shared across all covered family members under the floater',
    items: [
      {
        title: 'In-Patient Hospitalisation',
        description:
          'Up to Sum Insured for room, nursing, surgery and in-hospital expenses — shared across family.',
      },
      {
        title: 'Pre-Hospitalisation',
        description: '30 days of medical expenses before admission — diagnostics, consultations & medicines.',
      },
      {
        title: 'Post-Hospitalisation',
        description: '60 days of follow-up care after discharge — medicines, physiotherapy & doctor visits.',
      },
      {
        title: 'Day Care Procedures',
        description: 'Over 540 procedures covered for any family member — no 24-hour admission required.',
      },
      {
        title: 'Ambulance Cover',
        description: 'Up to ₹2,000 per hospitalisation for any family member — emergency ambulance charges.',
      },
      {
        title: 'Room Rent',
        description: '2% of SI/day for Normal ward; 4% of SI/day for ICU. Proportionate deduction on overage.',
      },
      {
        title: 'Co-Pay',
        description:
          '10% co-payment applicable on all claims for all family members. Insurer covers the remaining 90% of the admissible claim amount.',
        fullWidth: true,
      },
    ],
  },
  {
    type: 'waitGrid',
    icon: '⏳',
    iconVariant: 'indigo',
    title: 'Waiting Periods',
    subtitle: 'Standard waiting periods under the Family Floater plan',
    items: [
      { icon: '📅', label: 'Initial Waiting Period', period: '30 Days' },
      { icon: '🩺', label: 'Pre-Existing Disease (PED)', period: '12 Months ↓ Better', highlight: true },
      { icon: '🏥', label: 'Specific Disease / Procedure', period: '12 Months' },
      { icon: '⚡', label: 'Accidents', period: 'None — Day 1', noWait: true },
    ],
    callout:
      '✅ PED waiting period is 12 months under the Family Floater — significantly better than the 24-month period on the Individual plan.',
  },
  {
    type: 'premiumTables',
    icon: '₹',
    iconVariant: 'indigo',
    title: 'Premium at a Glance',
    subtitle: 'Annual premium for the entire family (up to 2A + 2C)',
    tables: [
      {
        caption: 'Age Band: 18–50 Years',
        headers: ['Sum Insured', 'Base Premium', 'With GST (18%)'],
        rows: [
          ['₹3,00,000', '₹6,278 / yr', '₹7,408 / yr'],
          ['₹5,00,000', '₹8,178 / yr', '₹9,650 / yr'],
        ],
      },
      {
        caption: 'Age Band: 51–65 Years',
        headers: ['Sum Insured', 'Base Premium', 'With GST (18%)'],
        rows: [
          ['₹3,00,000', '₹6,482 / yr', '₹7,649 / yr'],
          ['₹5,00,000', '₹9,765 / yr', '₹11,523 / yr'],
        ],
        note:
          '👨‍👩‍👧‍👦 Family Plan: Premium shown covers up to 2 Adults + 2 Children under one floater policy. Age band is determined by the eldest adult member insured.',
      },
    ],
  },
  {
    type: 'faq',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Can I add a newborn child to my existing floater policy?',
        answer:
          'Yes, you can add a newborn child to your Family Floater policy mid-term. You must notify the insurer within 90 days of the child birth and pay the additional pro-rata premium.',
      },
      {
        question: 'What happens if the full sum insured is used by one family member?',
        answer:
          'In a floater policy, the sum insured is shared across all members. If one member exhausts the entire sum insured, remaining family members will have no coverage for that policy year.',
      },
      {
        question: 'Is the pre-existing disease waiting period per person or for the whole family?',
        answer:
          'The PED waiting period applies per individual insured member, not for the whole family collectively.',
      },
      {
        question: 'Can I choose different sum insured for different family members?',
        answer:
          'No — under a floater policy, a single sum insured is shared among all covered members.',
      },
      {
        question: 'What is the age limit for children covered under the floater?',
        answer:
          'Children can be covered from 91 days (with newborn addition endorsement) up to 25 years of age, provided they are financially dependent on the policyholder.',
      },
    ],
  },
];

export const healthInsurancePageData: MarketingPageData = {
  seo: {
    title: 'Health Insurance — Bharat Arogya',
    description:
      'Bharat Arogya Individual and Family Floater health plans — cashless hospitals, day care, waiting periods and premiums at a glance.',
    openGraphTitle: 'BharatCover — Health cover for your whole family',
    openGraphDescription: 'Comprehensive cashless health insurance with hospitalisation cover across 6,000+ network hospitals.',
  },
  sections: [
    {
      type: 'heroNavy',
      tag: '🏥 Health Protection',
      headline: 'Health cover for you and your<br><em>whole family.</em>',
      description:
        'Comprehensive cashless health insurance with hospitalisation cover, day care, pre & post care across 6,000+ network hospitals.',
      buttons: [
        { label: 'Get covered now', href: '/personal/contact', variant: 'hero-primary' },
        { label: 'View premiums', href: '#premium-table', variant: 'hero-outline' },
      ],
      trustChips: [
        { text: 'Ages 18–65' },
        { text: 'Cashless hospitals' },
        { text: 'Pre & post care' },
        { text: 'Family floater' },
      ],
      image: {
        src: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80',
        alt: 'Indian family with doctor — health insurance',
      },
      priceCard: {
        label: 'Starts From',
        amount: '750',
        period: '/year',
        planLine: 'Health Insurance',
      },
    },
    {
      type: 'productTabs',
      tabs: [
        { id: 'individual', label: 'Individual Plan', badge: 'Bharat Arogya Individual', emoji: '🏥' },
        { id: 'floater', label: 'Family Floater', badge: 'Up to 2A+2C', emoji: '👨‍👩‍👧‍👦' },
      ],
      panels: {
        individual: individualCoverage,
        floater: floaterCoverage,
      },
    },
  ],
};
