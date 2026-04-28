'use client';

import { useState } from 'react';
import styles from './ProductMarketing.module.css';

export function BusinessCtaForm() {
  const [company, setCompany] = useState('');
  const [employees, setEmployees] = useState('');
  const [done, setDone] = useState(false);
  const [errC, setErrC] = useState(false);
  const [errE, setErrE] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const c = company.trim();
    const n = parseInt(employees, 10);
    setErrC(!c);
    setErrE(!n || n < 1);
    if (!c || !n || n < 1) return;
    setDone(true);
  }

  if (done) {
    return (
      <div className={`${styles.ctaSuccess} ${styles.visible}`} role="alert">
        Thank you! We&apos;ll be in touch within 24 hours.
      </div>
    );
  }

  return (
    <form className={styles.businessCtaForm} onSubmit={onSubmit} noValidate>
      <input
        type="text"
        name="companyName"
        placeholder="Your company name"
        autoComplete="organization"
        value={company}
        onChange={(e) => {
          setCompany(e.target.value);
          setErrC(false);
        }}
        className={errC ? styles.inputError : undefined}
        aria-label="Company name"
      />
      <input
        type="number"
        name="empCount"
        placeholder="Number of employees"
        min={1}
        value={employees}
        onChange={(e) => {
          setEmployees(e.target.value);
          setErrE(false);
        }}
        className={errE ? styles.inputError : undefined}
        aria-label="Number of employees"
      />
      <button type="submit" className={`${styles.btn} ${styles.btnTeal}`}>
        Request Quote
      </button>
    </form>
  );
}
