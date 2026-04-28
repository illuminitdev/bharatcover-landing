import type { MarketingPageData } from '@/types/product-page';

export const businessPageData: MarketingPageData = {
  seo: {
    title: 'Business Insurance',
    description:
      'Group health, accident, workmen compensation and institutional cover for corporates, SMEs, schools and NGOs.',
    openGraphTitle: 'BharatCover — Business Insurance',
    openGraphDescription: 'Insurance solutions for your business — tailored group plans from trusted underwriters.',
  },
  sections: [
    {
      type: 'heroSplit',
      headline: 'Insurance',
      headlineEm: 'Solutions',
      sub: 'Group health, accident, workmen compensation and institutional cover. Tailored for corporates, SMEs, schools and NGOs.',
      image: {
        src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
        alt: 'Indian business team in office',
      },
      priceCard: {
        label: 'Group Plans From',
        amount: '₹299',
        period: '/employee',
        planLine: 'Business Insurance Plans',
      },
      buttons: [
        { label: 'Request a Quote', href: '/business/contact', variant: 'teal' },
        { label: 'Speak to a Business Advisor', href: '/business/contact', variant: 'outline-white' },
      ],
    },
    {
      type: 'serveGrid',
      label: 'Who We Serve',
      title: 'Covering Every Kind of',
      titleUnderline: 'Organisation',
      sub: 'From large corporates to local schools, we have a group cover solution built for your type of organisation.',
      tiles: [
        { emoji: '🏢', title: 'Corporates & SMEs', description: 'Group health and accident plans for your entire workforce' },
        { emoji: '🎓', title: 'Schools & Colleges', description: 'Student and staff personal accident at institutional rates' },
        { emoji: '🏗️', title: 'Contractors & Industries', description: 'Workmen compensation for field staff and labour' },
        { emoji: '🤝', title: 'NGOs & Trusts', description: 'Affordable group cover for non-profit organisations' },
      ],
    },
    {
      type: 'prodCards',
      label: 'Business Products',
      title: 'Our Business',
      titleUnderline: 'Insurance Plans',
      sub: 'Statutory, group and institutional policies from India most trusted underwriters.',
      cards: [
        {
          icon: '🏥',
          iconBg: 'teal',
          badges: [{ text: 'Popular', variant: 'popular' }],
          tag: 'Magma General · Customisable',
          title: 'Group Health Insurance',
          description:
            'Comprehensive health cover for your entire workforce. Cashless hospitalisation, pre & post care, and day care procedures — tailored per headcount.',
          benefits: [
            'Cashless at 10,000+ Network Hospitals',
            'Pre & Post Hospitalisation Included',
            'Day Care Procedures Covered',
            'Customisable Sum Insured per Employee',
            'Family Extension Options Available',
          ],
          priceNote: 'Custom pricing based on group size and demographics',
          cta: { label: 'Request Group Quote →', href: '/business/contact', variant: 'teal' },
        },
        {
          icon: '⚡',
          iconBg: 'navy',
          tag: 'SBI General / Go Digit · Per Employee',
          title: 'Group Personal Accident',
          description:
            'Protect your workforce from accidental death, total and partial disability. No waiting period — coverage is effective from Day 1.',
          benefits: [
            'Accidental Death — 100% Sum Insured',
            'Permanent Total Disability (PTD)',
            'Permanent Partial Disability (PPD)',
            'No Waiting Period',
            'Scalable — from 5 employees upward',
          ],
          priceNote: 'Per-employee annual premium, volume discounts available',
          cta: { label: 'Request Group Quote →', href: '/business/contact', variant: 'outline-navy' },
        },
        {
          icon: '🎓',
          iconBg: 'teal',
          badges: [{ text: 'Institutional', variant: 'institutional' }],
          tag: 'SBI General / Go Digit · Institutional',
          title: 'School & College PA Cover',
          description:
            'Dedicated personal accident insurance for educational institutions. Covers students and staff with IRDAI-compliant institutional rates.',
          benefits: [
            'Student Accident Death & Disability Cover',
            'Staff Personal Accident Included',
            'IRDAI-Compliant Institutional Rates',
            'Covers Both On-Campus and Field Activities',
            'Bulk Policy Issuance Available',
          ],
          priceNote: 'Special institutional loading applies. Contact us for institutional rate card.',
          cta: { label: 'Get Institutional Quote →', href: '/business/contact', variant: 'teal' },
        },
        {
          icon: '⚙️',
          iconBg: 'navy',
          badges: [{ text: 'Statutory', variant: 'statutory' }],
          tag: 'IRDAI Regulated · Statutory',
          title: 'Workmen Compensation Insurance',
          description:
            "Statutory workmen compensation cover as required under the Employees' Compensation Act, 1923. Protects employers from liability claims.",
          benefits: [
            'Death & Disability Compensation',
            'Medical Expenses for Work Injuries',
            'Legal Liability Coverage',
            'Compliant with EC Act 1923',
            'Suitable for Contractors, Factories & Sites',
          ],
          priceNote: 'Premium based on wage bill and occupational risk category',
          cta: { label: 'Request WC Quote →', href: '/business/contact', variant: 'outline-navy' },
        },
      ],
    },
    {
      type: 'whyGrid',
      label: 'Why BharatCover',
      title: 'The Business Insurance Partner',
      titleUnderline: 'You Can Trust',
      sub: 'Everything your business needs — from custom group pricing to dedicated relationship management.',
      tiles: [
        { emoji: '📋', title: 'Custom Group Pricing', description: 'Rates tailored to your group size, demographics, and industry' },
        { emoji: '⚡', title: 'Fast Policy Issuance', description: 'Group policies issued quickly with minimal paperwork' },
        { emoji: '🏆', title: 'Trusted Underwriters', description: 'Backed by Magma General, SBI General and Go Digit' },
        { emoji: '🤝', title: 'Dedicated Relationship Manager', description: 'A single point of contact for your business account' },
        { emoji: '📊', title: 'Flexible Coverage Design', description: 'Mix and match covers to fit your specific workforce needs' },
        { emoji: '🇮🇳', title: 'IRDAI Regulated', description: 'Fully compliant with all IRDAI regulations and guidelines' },
      ],
    },
    {
      type: 'howSteps',
      label: 'How It Works',
      title: 'Getting Covered Is',
      titleUnderline: 'Simple',
      sub: 'Four steps from enquiry to full coverage for your entire organisation.',
      steps: [
        { num: '1', title: 'Share Your Requirements', description: 'Tell us your group size, industry and cover needs' },
        { num: '2', title: 'Receive Custom Quote', description: 'We prepare a tailored proposal within 24 hours' },
        { num: '3', title: 'Review & Confirm', description: 'Review terms, customise if needed, and confirm the plan' },
        { num: '4', title: 'Policies Issued', description: 'All employee certificates issued and coverage begins' },
      ],
    },
    {
      type: 'industries',
      label: 'Industries',
      title: 'Industries',
      titleUnderline: 'We Serve',
      sub: 'We have experience with group insurance across a wide range of sectors.',
      pills: [
        { emoji: '🏭', label: 'Manufacturing' },
        { emoji: '🏗️', label: 'Construction' },
        { emoji: '🏫', label: 'Education' },
        { emoji: '🏥', label: 'Healthcare' },
        { emoji: '🛒', label: 'Retail' },
        { emoji: '🚚', label: 'Logistics' },
        { emoji: '💻', label: 'Technology' },
        { emoji: '🤝', label: 'NGOs & Trusts' },
        { emoji: '⚡', label: 'Energy & Utilities' },
        { emoji: '🏨', label: 'Hospitality' },
      ],
    },
    {
      type: 'businessCta',
      label: 'Get Started Today',
      title: 'Ready to Protect Your',
      titleEm: 'Business?',
      sub: 'Get a custom group insurance quote within 24 hours. No obligation.',
    },
    {
      type: 'faq',
      label: 'FAQs',
      title: 'Frequently Asked',
      titleUnderline: 'Questions',
      sub: 'Answers to common questions about BharatCover business insurance solutions.',
      items: [
        {
          question: 'What is the minimum group size for Group Health Insurance?',
          answer:
            'Most insurers require a minimum of 7–10 active employees to issue a Group Health Insurance policy. Some underwriters may accommodate smaller groups.',
        },
        {
          question: 'Can we customise the sum insured per employee level or grade?',
          answer:
            'Yes. Group Health and Group PA policies can be structured with graded sum insured — for example, senior management may receive a higher sum insured.',
        },
        {
          question: 'Is workmen compensation insurance mandatory?',
          answer:
            "Yes. Under the Employees' Compensation Act, 1923, employers in specified industries are legally required to provide compensation cover.",
        },
        {
          question: 'How quickly are group policies issued after payment?',
          answer:
            'Once premium payment is confirmed and all employee data is submitted, group policies are typically issued within 3–5 working days.',
        },
        {
          question: 'Can employees add family members to the group health plan?',
          answer:
            'Yes, most group health policies can be extended to cover an employee spouse, dependent children, and in some cases dependent parents.',
        },
      ],
    },
  ],
};
