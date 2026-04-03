'use client';

import { motion } from 'framer-motion';
import styles from './Spotlight.module.css';

export function Spotlight() {
  return (
    <motion.div
      className={styles.spotlight}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <div className={styles.spotlightBeam}></div>
    </motion.div>
  );
}
