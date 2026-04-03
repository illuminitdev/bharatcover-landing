'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './MovingBorderButton.module.css';

interface MovingBorderButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'medium' | 'large';
}

export function MovingBorderButton({
  href,
  children,
  variant = 'primary',
  size = 'medium'
}: MovingBorderButtonProps) {
  return (
    <Link href={href}>
      <motion.button
        className={`${styles.button} ${styles[variant]} ${styles[size]}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={styles.border}></span>
        <span className={styles.content}>{children}</span>
      </motion.button>
    </Link>
  );
}
