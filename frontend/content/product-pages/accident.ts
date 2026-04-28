import type { MarketingPageData, MarketingSection } from '@/types/product-page';

const bodySections: MarketingSection[] = [
  {
    type: 'coverageCard',
    icon: '✅',
    iconVariant: 'sage',
    title: "What's Covered",
    subtitle: 'Core benefits included in all Personal Accident plans',
    items: [
      {
        title: 'Accidental Death (AD)',
        description: 'Full sum insured paid to nominee in the event of death caused directly by an accident.',
      },
      {
        title: 'Permanent Total Disability (PTD)',
        description: '100% sum insured paid for loss of both limbs, both eyes, or one limb + one eye due to accident.',
      },
      {
        title: 'Permanent Partial Disability (PPD)',
        description: 'Proportionate benefit as per the Schedule of Benefits — loss of specific limbs or sensory organs.',
      },
      {
        title: '24/7 Worldwide Coverage',
        description: 'Coverage is active round-the-clock — at work, at home, travelling — anywhere in the world.',
      },
    ],
    footerNote:
      '💡 No waiting period applies on Personal Accident plans. Coverage begins from Day 1 of the policy. No pre-medical examination required for sum insured up to ₹15 Lakh.',
  },
  {
    type: 'premiumTables',
    icon: '₹',
    iconVariant: 'indigo',
    title: 'Premium at a Glance',
    subtitle: 'Annual premium across all sum insured options — unit rate for ages 18–65',
    anchorId: 'pa-premiums',
    tables: [
      {
        headers: ['Sum Insured', 'Coverage', 'Base Premium', 'Premium + GST (18%)'],
        rows: [
          ['₹1,00,000', 'AD + PTD + PPD', '₹20 / yr', '₹24 / yr'],
          ['₹5,00,000', 'AD + PTD + PPD', '₹100 / yr', '₹118 / yr'],
          ['₹10,00,000', 'AD + PTD + PPD', '₹200 / yr', '₹236 / yr'],
          ['₹15,00,000', 'AD + PTD + PPD', '₹300 / yr', '₹354 / yr'],
        ],
        note:
          '⚡ Unit Rate — same premium applies to all ages between 18 and 65 years. GST at 18% is applicable on the base premium.',
      },
    ],
  },
  {
    type: 'exclusions',
    icon: '🚫',
    title: 'What is Not Covered',
    subtitle: 'Exclusions that apply to Personal Accident policies',
    items: [
      {
        icon: '🩺',
        title: 'Illness or Disease',
        description:
          'Death or disability caused by sickness, medical conditions, or natural diseases is not covered — only accidents qualify.',
      },
      {
        icon: '🍺',
        title: 'Alcohol or Drug Influence',
        description:
          'Claims arising when the insured was under the influence of alcohol, narcotics, or any intoxicating substance at the time of accident.',
      },
      {
        icon: '⚠️',
        title: 'Self-Inflicted Injury',
        description:
          'Intentional self-harm, attempted suicide, or any deliberate bodily injury — irrespective of mental state at the time.',
      },
      {
        icon: '⚖️',
        title: 'Criminal or Illegal Activity',
        description:
          'Accidents occurring while the insured is engaged in any criminal or unlawful act, including participation in riots.',
      },
      {
        icon: '✈️',
        title: 'Aviation (Non-Commercial)',
        description:
          'Injuries during private flying, skydiving, paragliding or air sports are excluded. Scheduled commercial passenger flights are covered.',
      },
      {
        icon: '🌊',
        title: 'Hazardous Activities',
        description:
          'Motor racing, mountaineering above 6,000 ft, bungee jumping, and professional extreme sports are excluded from cover.',
      },
      {
        icon: '🪖',
        title: 'War & Terrorism',
        description:
          'Any loss arising from war (declared or undeclared), invasion, revolution, nuclear, biological, or chemical events.',
      },
      {
        icon: '🦠',
        title: 'Pre-existing Disability',
        description: 'Any disability or condition that existed before the policy inception date is not eligible for PA claim benefits.',
      },
    ],
    footerHtml:
      '📋 For the complete exclusions list, refer to the <a href="https://www.sbigeneral.com" target="_blank" rel="noopener noreferrer">SBI General Policy Wordings</a> available on the insurer website.',
  },
  {
    type: 'storyExample',
    icon: '💡',
    title: 'Real-life Example',
    subtitle: 'How Bharat Suraksha PA Cover works when you need it most',
    profile: {
      avatar: '👷',
      name: 'Rajan Kumar, 35',
      role: 'Construction Supervisor · Bengaluru',
      badge: 'Bharat Suraksha PA · ₹10 Lakh SI',
    },
    incidentLabel: '🔴 What happened',
    incidentText:
      'While inspecting a construction site, Rajan slipped from scaffolding and fractured his right wrist. Due to complications, he permanently lost 60% mobility of his dominant hand — classified as Permanent Partial Disability (PPD) under his SBI General PA policy.',
    outcomeLabel: '✅ What Bharat Suraksha paid',
    calcRows: [
      { key: 'Sum Insured', val: '₹10,00,000' },
      { key: 'PPD Schedule (loss of hand — 60%)', val: '× 60%' },
      { key: 'Claim Paid', val: '₹6,00,000', total: true },
    ],
    outcomeNote:
      'Rajan received ₹6 Lakh within 15 working days of claim settlement — enough to cover medical expenses, home loan EMIs for 8 months, and support his family while recovering.',
    premiumNote: '💰 Rajan paid just ₹236/year (incl. GST) for ₹10L cover — less than ₹20 per month.',
  },
  {
    type: 'coverageCard',
    icon: '⭐',
    iconVariant: 'saffron',
    title: 'Why Choose This Plan',
    subtitle: 'Key advantages that make this product stand out',
    items: [
      {
        title: "India's Most Affordable PA",
        description: '₹24/year for ₹1 Lakh cover — less than a cup of tea per month for full accident protection.',
      },
      {
        title: 'No Age Loading',
        description: 'Flat unit rate — whether you are 18 or 65, you pay the same premium. Fair pricing for everyone.',
      },
      {
        title: 'SBI General Backed',
        description: "One of India's most trusted and claim-paying insurers — backed by State Bank of India group.",
      },
      {
        title: 'Instant Policy Issuance',
        description: 'Digital policy document delivered within minutes. No paperwork, no hassle.',
      },
    ],
  },
  {
    type: 'faq',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Is there a waiting period for Personal Accident cover?',
        answer:
          'No — Personal Accident policies have no waiting period. Coverage begins from Day 1 of the policy inception date.',
      },
      {
        question: 'Can I buy this for my family members too?',
        answer:
          'Yes. You can purchase individual PA policies for each family member — spouse, children, and parents — with separate sum insured for each.',
      },
      {
        question: 'What counts as an "accident" under this policy?',
        answer:
          'An accident is defined as a sudden, unexpected, external, and involuntary event. This includes road accidents, falls, burns, drowning, and other physical mishaps.',
      },
      {
        question: 'What is PTD vs PPD benefit?',
        answer:
          'PTD (Permanent Total Disability) pays 100% of sum insured for complete loss of use of both hands, both legs, or combination of limb and eye. PPD pays a proportionate percentage as per the insurer Schedule of Benefits.',
      },
      {
        question: 'How do I file a claim under Bharat Suraksha PA Cover?',
        answer:
          'Inform BharatCover or SBI General within 7 days of the accident. Submit the claim form along with FIR (if applicable), medical reports, discharge summary, and identity proof.',
      },
      {
        question: 'Am I covered if an accident happens while travelling abroad?',
        answer:
          "Yes — SBI General's Personal Accident policy provides worldwide coverage for accidental death and disability under the same terms.",
      },
      {
        question: 'What documents do I need to buy this policy?',
        answer:
          'For most PA policies with sum insured up to ₹15 Lakh, no medical examination is required. You will need identity proof, address proof, a recent photograph, and bank account details.',
      },
      {
        question: 'Can I cancel the policy and get a refund?',
        answer:
          'Yes. During the free-look period (15 days from policy receipt), you can cancel for a full refund minus stamp duty and proportionate risk premium for days on cover.',
      },
      {
        question: 'Is my occupation relevant? Do high-risk jobs pay more premium?',
        answer:
          'Yes — occupations are classified into risk categories (Class 1 to 4). Class 1 (sedentary/office work) pays the standard rate.',
      },
      {
        question: 'What is the maximum sum insured available?',
        answer:
          'Under SBI General PA product, sum insured up to ₹15 Lakh is available through BharatCover without additional documentation.',
      },
    ],
  },
];

export const accidentPageData: MarketingPageData = {
  seo: {
    title: 'Personal Accident Cover — Bharat Suraksha',
    description:
      'Bharat Suraksha Personal Accident cover from SBI General / Go Digit — AD, PTD, PPD, premiums from ₹24/year, no waiting period.',
    openGraphTitle: 'BharatCover — Personal Accident Cover',
    openGraphDescription:
      "Simple, affordable annual accident cover for individuals and families. Choose the sum insured that fits your budget.",
  },
  sections: [
    {
      type: 'heroNavy',
      tag: 'Bharat Suraksha · Personal Accident Cover',
      headline: "Accident cover that<br>protects your<br><em>family's income.</em>",
      productName: 'Bharat Suraksha — Personal Accident Cover',
      description:
        'Simple, affordable annual accident cover for individuals and families. Choose the sum insured that fits your budget and get guidance from BharatCover advisors.',
      buttons: [
        { label: 'Get covered now', href: '/sales/quote?si=1000000&gst=1', variant: 'hero-primary' },
        { label: 'View premiums', href: '#pa-premiums', variant: 'hero-outline' },
      ],
      trustChips: [
        { text: '18–65 years' },
        { text: '1-year policy' },
        { text: 'GST included' },
        { text: 'Individual & group use' },
      ],
      image: {
        src: 'https://images.unsplash.com/photo-1609220136736-443140cfeaa8?auto=format&fit=crop&w=800&q=80',
        alt: 'Happy Indian family protected by BharatCover',
      },
      priceCard: {
        label: 'Starts From',
        amount: '299',
        period: '/year',
        planLine: 'Personal Accident Cover',
      },
    },
    { type: 'stack', variant: 'layout', sections: bodySections },
  ],
};
