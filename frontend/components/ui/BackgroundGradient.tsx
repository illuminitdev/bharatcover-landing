'use client';

import { motion } from 'framer-motion';
import styles from './BackgroundGradient.module.css';

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
}

export function BackgroundGradient({ children, className = '' }: BackgroundGradientProps) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.gradientBg}>
        <motion.div
          className={styles.blob1}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className={styles.blob2}
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className={styles.blob3}
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
