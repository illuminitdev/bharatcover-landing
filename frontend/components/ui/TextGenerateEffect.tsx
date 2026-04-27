'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
}

export function TextGenerateEffect({ words, className = '' }: TextGenerateEffectProps) {
  const [wordArray, setWordArray] = useState<string[]>([]);

  useEffect(() => {
    setWordArray(words.split(' '));
  }, [words]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {wordArray.map((word, idx) => (
        <motion.span key={idx} variants={child} style={{ display: 'inline-block', marginRight: '0.25em' }}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
