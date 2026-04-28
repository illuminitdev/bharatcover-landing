'use client';

import { useState } from 'react';
import type { FaqItem } from '@/types/product-page';
import styles from './ProductMarketing.module.css';

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={styles.faqList}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
            <button
              type="button"
              className={styles.faqQuestion}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.question}
              <span className={styles.faqIcon} aria-hidden>
                +
              </span>
            </button>
            <div className={styles.faqAnswer}>
              <div className={styles.faqAnswerInner}>{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
