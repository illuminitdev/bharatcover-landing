'use client';

import { motion } from 'framer-motion';
import styles from './LampEffect.module.css';

interface LampEffectProps {
  children: React.ReactNode;
}

export function LampEffect({ children }: LampEffectProps) {
  return (
    <div className={styles.lampContainer}>
      <div className={styles.lampWrapper}>
        <motion.div
          initial={{ opacity: 0, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className={styles.lampLight}
        >
          <div className={styles.lampGradient}></div>
        </motion.div>
        <motion.div
          initial={{ width: '15rem' }}
          whileInView={{ width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className={styles.lampLight2}
        >
          <div className={styles.lampGradient2}></div>
        </motion.div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
