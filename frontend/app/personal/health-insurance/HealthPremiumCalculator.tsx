'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from './health-insurance.module.css';

type Option = {
  amount: number;
  short: string;
  label: string;
  basePremium: number;
};

const OPTIONS: Option[] = [
  { amount: 100000, short: '₹1L', label: '1 Lakh', basePremium: 750 },
  { amount: 200000, short: '₹2L', label: '2 Lakhs', basePremium: 1050 },
  { amount: 300000, short: '₹3L', label: '3 Lakhs', basePremium: 1250 },
  { amount: 500000, short: '₹5L', label: '5 Lakhs', basePremium: 2050 },
];

export default function HealthPremiumCalculator() {
  const [selectedAmount, setSelectedAmount] = useState(300000);
  const [includeGst, setIncludeGst] = useState(false);

  const selected = useMemo(() => OPTIONS.find((opt) => opt.amount === selectedAmount) ?? OPTIONS[2], [selectedAmount]);
  const finalPremium = includeGst ? Math.round(selected.basePremium * 1.18) : selected.basePremium;

  return (
    <div className={styles.calcCard}>
      <div className={styles.calcHeader}>
        <h3 className={styles.calcTitle}>Calculate Your Premium</h3>
        <span className={styles.calcPill}>Individual</span>
      </div>

      <p className={styles.calcSubText}>Select sum insured</p>

      <div className={styles.siGrid}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.amount}
            type="button"
            className={`${styles.siBox} ${selectedAmount === opt.amount ? styles.siBoxActive : ''}`}
            onClick={() => setSelectedAmount(opt.amount)}
          >
            <strong>{opt.short}</strong>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      <button type="button" className={styles.gstToggle} onClick={() => setIncludeGst((prev) => !prev)}>
        <span>Include GST (18%)</span>
        <span className={`${styles.toggleSwitch} ${includeGst ? styles.toggleSwitchOn : ''}`}>
          <span className={styles.toggleKnob} />
        </span>
      </button>

      <div className={styles.premiumBox}>
        <h4>Annual Premium</h4>
        <p>₹{finalPremium.toLocaleString('en-IN')}</p>
        <small>{includeGst ? `Includes 18% GST · ₹${selected.basePremium} base` : 'Base premium · GST excluded'}</small>
      </div>

      <Link href={`/sales/quote?si=${selected.amount}&gst=${includeGst ? '1' : '0'}`} className={styles.buyBtn}>
         But Now →
      </Link>
      <button className={styles.outlineBtn} type="button">
        📞 Talk to Advisor
      </button>
    </div>
  );
}
