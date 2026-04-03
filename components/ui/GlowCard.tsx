'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from './GlowCard.module.css';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowCard({ children, className = '' }: GlowCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className={`${styles.card} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {isHovering && (
        <div
          className={styles.glow}
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />
      )}
      <div className={styles.content}>{children}</div>
    </motion.div>
  );
}
