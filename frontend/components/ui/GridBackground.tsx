'use client';

import styles from './GridBackground.module.css';

export function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}></div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
