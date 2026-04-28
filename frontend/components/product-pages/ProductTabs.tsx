'use client';

import { useState } from 'react';
import type { MarketingSection } from '@/types/product-page';
import { MarketingSections } from './MarketingSections';
import styles from './ProductMarketing.module.css';

type TabDef = { id: string; label: string; badge?: string; emoji?: string };

type ProductTabsProps = {
  tabs: TabDef[];
  panels: Record<string, MarketingSection[]>;
};

export function ProductTabs({ tabs, panels }: ProductTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');

  return (
    <>
      <div className={styles.tabBar}>
        <div className={styles.tabInner}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.prodTab} ${active === t.id ? styles.prodTabActive : ''}`}
              onClick={() => setActive(t.id)}
            >
              <span>
                {t.emoji ? `${t.emoji} ` : ''}
                {t.label}
              </span>
              {t.badge ? <span className={styles.tabBadge}>{t.badge}</span> : null}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((t) =>
        active === t.id ? (
          <div key={t.id} className={styles.layout}>
            <MarketingSections sections={panels[t.id] ?? []} />
          </div>
        ) : null
      )}
    </>
  );
}
