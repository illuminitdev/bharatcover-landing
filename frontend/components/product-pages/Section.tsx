import type { ReactNode } from 'react';
import styles from './Section.module.css';

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={[styles.section, className].filter(Boolean).join(' ')}>
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
