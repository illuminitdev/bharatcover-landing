'use client';

import { motion } from 'framer-motion';
import styles from './HeroHighlight.module.css';

interface HeroHighlightProps {
  children: React.ReactNode;
}

export function HeroHighlight({ children }: HeroHighlightProps) {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.gradient}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export function Highlight({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      initial={{ backgroundSize: '0% 100%' }}
      animate={{ backgroundSize: '100% 100%' }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className={`${styles.highlight} ${className}`}
    >
      {children}
    </motion.span>
  );
}
