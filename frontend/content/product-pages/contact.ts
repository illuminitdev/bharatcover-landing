import type { ContactPageData } from '@/types/product-page';

export const contactPageData: ContactPageData = {
  seo: {
    title: 'Contact Us & Get a Quote',
    description:
      'Reach BharatCover for personal and business insurance quotes. Toll-free, WhatsApp, email and callback within 2 hours.',
    openGraphTitle: 'BharatCover — Contact Us & Get a Quote',
    openGraphDescription:
      'Talk to a licensed advisor. Request a free quote for health, accident or group cover.',
  },
  hero: {
    tag: '📞 Get in Touch',
    titleLine1: 'Talk to an Advisor.',
    titleLine2: 'Get the',
    titleEmphasis: 'Right Cover.',
    description:
      'Leave your details and our licensed advisors will call back within 2 hours — no spam, no pushy sales.',
    channels: [
      { icon: '📞', label: '1800-123-456 (Toll Free)', href: 'tel:+911800123456' },
      { icon: '💬', label: 'WhatsApp Us', href: 'https://wa.me/911234567890', external: true },
      { icon: '✉️', label: 'hello@bharatcover.net', href: 'mailto:hello@bharatcover.net' },
    ],
    visual: {
      src: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80',
      alt: 'BharatCover insurance advisor with client',
    },
    priceCard: {
      label: 'Callback Within',
      value: '2 hrs',
      sub: 'Mon–Sat · 9 AM – 7 PM',
    },
  },
  form: {
    title: 'Request a Free Quote',
    subtitle:
      "Fill in your details and we'll prepare a personalised insurance recommendation for you.",
    rows: [
      [
        { id: 'cName', label: 'Full Name', required: true, type: 'text', placeholder: 'e.g. Priya Sharma' },
        {
          id: 'cPhone',
          label: 'Mobile Number',
          required: true,
          type: 'tel',
          placeholder: '10-digit mobile',
          maxLength: 10,
        },
      ],
      [
        { id: 'cEmail', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
        { id: 'cCity', label: 'City', type: 'text', placeholder: 'e.g. Mumbai' },
      ],
      [
        {
          id: 'cCount',
          label: 'Number of People to Cover',
          type: 'select',
          options: [
            '',
            'Just Me',
            'Me + Spouse',
            'Me + Family (2–4)',
            'Me + Family (5+)',
            'Employee Group (10+)',
            'Employee Group (50+)',
          ],
        },
        {
          id: 'cBudget',
          label: 'Budget (Annual Premium)',
          type: 'select',
          options: ['', 'Under ₹500', '₹500 – ₹2,000', '₹2,000 – ₹10,000', '₹10,000 – ₹50,000', '₹50,000+'],
        },
      ],
      [
        {
          id: 'cMessage',
          label: "Anything specific you'd like us to know?",
          type: 'textarea',
          placeholder:
            'e.g. I need a policy that covers my 60-year-old mother, or I want coverage for a 30-person team...',
        },
      ],
      [
        {
          id: 'cTime',
          label: 'Preferred Callback Time',
          type: 'select',
          options: ['', 'Any time', '9 AM – 11 AM', '11 AM – 1 PM', '1 PM – 3 PM', '3 PM – 5 PM', '5 PM – 7 PM'],
        },
        {
          id: 'cSource',
          label: 'How did you hear about us?',
          type: 'select',
          options: [
            '',
            'Google Search',
            'Friend / Colleague',
            'Social Media',
            'WhatsApp',
            'Agent Referral',
            'Other',
          ],
        },
      ],
    ],
    interests: {
      label: "I'm interested in",
      options: [
        { id: 'pa', label: '🛡️ Personal Accident Cover' },
        { id: 'health', label: '🏥 Health Insurance' },
        { id: 'floater', label: '👨‍👩‍👧 Family Floater Health' },
        { id: 'business', label: '🏢 Business / Group Cover' },
        { id: 'wc', label: '💼 Workmen Compensation' },
        { id: 'advice', label: '🔍 Not Sure — Need Advice' },
      ],
    },
    submitLabel: '🚀 Request Free Quote & Callback',
    privacyNote:
      '🔒 Your details are 100% secure and will never be shared with third parties. IRDAI-regulated. No spam.',
  },
  sidebar: [
    {
      kind: 'infoCard',
      title: 'Reach Us Directly',
      subtitle: 'Multiple ways to connect with our team',
      items: [
        {
          icon: '📞',
          iconVariant: 'teal',
          label: 'Toll Free',
          value: '1800-123-456',
          sub: 'Mon–Sat · 9 AM – 7 PM',
          href: 'tel:+911800123456',
        },
        {
          icon: '💬',
          iconVariant: 'teal',
          label: 'WhatsApp',
          value: '+91 7842060960',
          sub: 'Reply within 30 minutes',
          href: 'https://wa.me/911234567890',
          external: true,
        },
        {
          icon: '✉️',
          iconVariant: 'navy',
          label: 'Email',
          value: 'hello@bharatcover.net',
          sub: 'We reply within 4 business hours',
          href: 'mailto:hello@bharatcover.net',
        },
        {
          icon: '📍',
          iconVariant: 'green',
          label: 'Office',
          value: 'BharatCover Insurance Broking',
          sub: 'VS Enterprises, Hyderabad, Telangana',
        },
      ],
    },
    {
      kind: 'hours',
      title: 'Working Hours',
      rows: [
        { day: 'Mon – Fri', time: '9:00 AM – 7:00 PM', today: true },
        { day: 'Saturday', time: '9:00 AM – 5:00 PM' },
        { day: 'Sunday', time: 'Closed' },
        { day: 'Public Holidays', time: 'Emergency only' },
      ],
    },
    {
      kind: 'ctaCard',
      title: 'Need it Urgently?',
      body: 'For claim emergencies or urgent policy queries, call us directly on our priority line.',
      button: { label: '📞 Call Now — Free', href: 'tel:+911800123456', variant: 'teal' },
    },
    {
      kind: 'partners',
      title: 'Our Insurance Partners',
      partners: ['SBI General Insurance Co. Ltd.', 'Magma General Insurance Co. Ltd.', 'Go Digit General Insurance Ltd.'],
      footnote: 'IRDAI Broker Reg. No. XXXXX · All products are subject to insurer T&C',
    },
  ],
};
