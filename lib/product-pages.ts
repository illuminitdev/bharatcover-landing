/** Static product HTML pages under `/product_pages/[file]` (served from repo `product_pages/`). */
export const PRODUCT_PAGE_FILES = [
  'index.html',
  'personal.html',
  'bharatcover_product_page_v2.html',
  'health-insurance.html',
  'health-quote.html',
  'business.html',
  'contact.html',
] as const;

export type ProductPageFile = (typeof PRODUCT_PAGE_FILES)[number];

export const PRODUCT_PAGE_LINKS: { file: ProductPageFile; label: string }[] = [
  { file: 'index.html', label: 'Insurance overview' },
  { file: 'personal.html', label: 'Personal insurance' },
  { file: 'bharatcover_product_page_v2.html', label: 'Personal accident cover' },
  { file: 'health-insurance.html', label: 'Health insurance' },
  { file: 'health-quote.html', label: 'Health insurance quote' },
  { file: 'business.html', label: 'Business insurance' },
  { file: 'contact.html', label: 'Contact & quote' },
];
