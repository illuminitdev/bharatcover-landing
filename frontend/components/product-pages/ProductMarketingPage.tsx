import type { MarketingSection } from '@/types/product-page';
import styles from './ProductMarketing.module.css';
import { MarketingSections } from './MarketingSections';

export function ProductMarketingPage({ sections }: { sections: MarketingSection[] }) {
  return (
    <div className={styles.marketingRoot}>
      <MarketingSections sections={sections} />
    </div>
  );
}
