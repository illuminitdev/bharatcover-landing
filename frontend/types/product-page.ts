/** Shared SEO + Open Graph strings for product/marketing routes */
export type ProductPageSeo = {
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
};

export type ProductLink = {
  label: string;
  href: string;
  variant?:
    | 'teal'
    | 'outline-white'
    | 'outline-navy'
    | 'hero-primary'
    | 'hero-outline'
    | 'sm-outline';
  external?: boolean;
};

export type HeroTrustChip = { text: string };

export type HeroSplitSection = {
  type: 'heroSplit';
  headline: string;
  headlineEm?: string;
  sub: string;
  subHighlight?: string;
  image: { src: string; alt: string };
  priceCard: { label: string; amount: string; period?: string; planLine: string };
  buttons: ProductLink[];
};

export type HeroNavySection = {
  type: 'heroNavy';
  tag?: string;
  headline: string;
  headlineHtmlLines?: boolean;
  productName?: string;
  description: string;
  buttons: ProductLink[];
  trustChips?: HeroTrustChip[];
  image: { src: string; alt: string };
  priceCard: { label: string; amount: string; period?: string; planLine: string };
};

export type SectionIntro = {
  type: 'sectionIntro';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
};

export type PlanBenefitLine = { strong?: string; text: string };

export type PlanCard = {
  badge?: { text: string; variant: 'green' | 'teal' };
  icon: string;
  iconVariant: 'teal' | 'navy';
  insurer: string;
  tagLine: string;
  title: string;
  description: string;
  benefits: PlanBenefitLine[];
  priceRow: { kind: 'from'; from: string; amount: string; period: string; gstNote?: string } | { kind: 'full'; text: string; gstNote?: string };
  pills: string[];
  note?: string;
  cta: ProductLink;
};

export type PlanCardsSection = {
  type: 'planCards';
  cards: PlanCard[];
};

export type WaitingTableSection = {
  type: 'waitingTable';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
  columns: string[];
  rows: Array<Array<string | { kind: 'none'; text: string }>>;
};

export type FeatureTile = { icon: string; title: string; description: string };

export type FeatureGridSection = {
  type: 'featureGrid';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
  tiles: FeatureTile[];
};

export type StepItem = { number: string; title: string; description: string };

export type StepsSection = {
  type: 'steps';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
  steps: StepItem[];
};

export type FaqItem = { question: string; answer: string };

export type FaqSection = {
  type: 'faq';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
  items: FaqItem[];
};

export type CtaBandSection = {
  type: 'ctaBand';
  title: string;
  sub: string;
  buttons: ProductLink[];
};

export type ServeTile = { emoji: string; title: string; description: string };

export type ServeGridSection = {
  type: 'serveGrid';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
  tiles: ServeTile[];
};

export type ProdCard = {
  icon: string;
  iconBg: 'teal' | 'navy';
  badges?: Array<{ text: string; variant: 'popular' | 'institutional' | 'statutory' }>;
  tag: string;
  title: string;
  description: string;
  benefits: string[];
  priceNote: string;
  cta: ProductLink;
};

export type ProdCardsSection = {
  type: 'prodCards';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
  cards: ProdCard[];
};

export type WhyTile = { emoji: string; title: string; description: string };

export type WhyGridSection = {
  type: 'whyGrid';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
  tiles: WhyTile[];
};

export type HowStep = { num: string; title: string; description: string };

export type HowSection = {
  type: 'howSteps';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
  steps: HowStep[];
};

export type IndustriesSection = {
  type: 'industries';
  label?: string;
  title: string;
  titleUnderline?: string;
  sub?: string;
  pills: Array<{ emoji: string; label: string }>;
};

export type BusinessCtaSection = {
  type: 'businessCta';
  label?: string;
  title: string;
  titleEm?: string;
  sub: string;
};

export type CoverageItem = { title: string; description: string; fullWidth?: boolean };

export type CoverageCardSection = {
  type: 'coverageCard';
  icon: string;
  iconVariant: 'sage' | 'indigo' | 'red' | 'sky' | 'saffron';
  title: string;
  subtitle?: string;
  items: CoverageItem[];
  footerNote?: string;
};

export type WaitItem = { icon: string; label: string; period: string; highlight?: boolean; noWait?: boolean };

export type WaitGridSection = {
  type: 'waitGrid';
  icon: string;
  iconVariant: 'indigo';
  title: string;
  subtitle?: string;
  items: WaitItem[];
  callout?: string;
};

export type PremiumTableBlock = {
  caption?: string;
  headers: string[];
  rows: string[][];
  note?: string;
};

export type PremiumTablesSection = {
  type: 'premiumTables';
  icon: string;
  iconVariant: 'indigo';
  title: string;
  subtitle?: string;
  tables: PremiumTableBlock[];
  /** For in-page anchors (e.g. hero CTA) */
  anchorId?: string;
};

export type ExclusionItem = { icon: string; title: string; description: string };

export type ExclusionsSection = {
  type: 'exclusions';
  icon: string;
  title: string;
  subtitle?: string;
  items: ExclusionItem[];
  footerHtml?: string;
};

export type StoryExampleSection = {
  type: 'storyExample';
  icon: string;
  title: string;
  subtitle?: string;
  profile: { avatar: string; name: string; role: string; badge: string };
  incidentLabel: string;
  incidentText: string;
  outcomeLabel: string;
  calcRows: Array<{ key: string; val: string; total?: boolean }>;
  outcomeNote: string;
  premiumNote: string;
};

export type ProductTabsSection = {
  type: 'productTabs';
  tabs: Array<{ id: string; label: string; badge?: string; emoji?: string }>;
  panels: Record<string, MarketingSection[]>;
};

export type HealthQuoteHeroSection = {
  type: 'healthQuoteHero';
  progressPercent: number;
  planTag: string;
  title: string;
  titleEm?: string;
  description: string;
  chips: string[];
  premLabel: string;
  premAmount: string;
  premSub: string;
};

export type HealthQuoteStepsSection = {
  type: 'healthQuoteSteps';
  steps: Array<{ num: string; label: string; active?: boolean }>;
};

export type InfoCalloutSection = {
  type: 'infoCallout';
  title: string;
  body: string;
  links: ProductLink[];
};

/** Group sections (e.g. main column body under hero) */
export type StackSection = {
  type: 'stack';
  variant?: 'layout';
  sections: MarketingSection[];
};

export type MarketingSection =
  | HeroSplitSection
  | HeroNavySection
  | SectionIntro
  | PlanCardsSection
  | WaitingTableSection
  | FeatureGridSection
  | StepsSection
  | FaqSection
  | CtaBandSection
  | ServeGridSection
  | ProdCardsSection
  | WhyGridSection
  | HowSection
  | IndustriesSection
  | BusinessCtaSection
  | CoverageCardSection
  | WaitGridSection
  | PremiumTablesSection
  | ExclusionsSection
  | StoryExampleSection
  | ProductTabsSection
  | HealthQuoteHeroSection
  | HealthQuoteStepsSection
  | InfoCalloutSection
  | StackSection;

export type MarketingPageData = {
  seo: ProductPageSeo;
  sections: MarketingSection[];
};

/** Contact page (separate layout: form + sidebar) */
export type ContactHeroChannel = { icon: string; label: string; href: string; external?: boolean };

export type ContactHeroData = {
  tag: string;
  titleLine1: string;
  titleLine2: string;
  titleEmphasis: string;
  description: string;
  channels: ContactHeroChannel[];
  visual: { src: string; alt: string };
  priceCard: { label: string; value: string; sub: string };
};

export type ContactFormSelectOption = string | { value: string; label: string };

export type ContactFormField = {
  id: string;
  label: string;
  required?: boolean;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  options?: ContactFormSelectOption[];
  maxLength?: number;
};

export type ContactInterestOption = { id: string; label: string };

export type ContactSidebarBlock =
  | {
      kind: 'infoCard';
      title: string;
      subtitle: string;
      items: Array<{
        icon: string;
        iconVariant: 'teal' | 'navy' | 'green';
        label: string;
        value: string;
        sub?: string;
        href?: string;
        external?: boolean;
      }>;
    }
  | { kind: 'hours'; title: string; rows: Array<{ day: string; time: string; today?: boolean }> }
  | { kind: 'ctaCard'; title: string; body: string; button: ProductLink }
  | { kind: 'partners'; title: string; partners: string[]; footnote: string };

export type ContactPageData = {
  seo: ProductPageSeo;
  hero: ContactHeroData;
  form: {
    title: string;
    subtitle: string;
    rows: ContactFormField[][];
    interests: { label: string; options: ContactInterestOption[] };
    submitLabel: string;
    privacyNote: string;
  };
  sidebar: ContactSidebarBlock[];
};
