'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaLock } from 'react-icons/fa';
import { createGuestSessionAndStore } from '@/lib/guest-api';
import styles from './contact.module.css';

function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = searchParams.get('product') ?? 'pa-standard';

  const initialFromQuery = useMemo(
    () => ({
      phone: (searchParams.get('phone') ?? '').replace(/\D/g, '').slice(-10),
      email: (searchParams.get('email') ?? '').trim(),
    }),
    [searchParams]
  );

  const [formData, setFormData] = useState(initialFromQuery);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setSubmitting(true);
    try {
      const result = await createGuestSessionAndStore({
        productId: product,
        phone: formData.phone,
        email: formData.email,
      });
      if (!result.ok) {
        if (result.accountExists) {
          setError('Account on this mobile or email already exists.');
          return;
        }
        setError(result.error);
        return;
      }
      router.push(`/sales/checkout?product=${encodeURIComponent(product)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '66%' }}></div>
        </div>
        <div className={styles.progressSteps}>
          <div className={`${styles.step} ${styles.stepActive}`}>Select Plan</div>
          <div className={`${styles.step} ${styles.stepActive}`}>Contact Info</div>
          <div className={styles.step}>Checkout</div>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2>Secure Details</h2>
          <p>Please provide your contact information to proceed with the policy issuance.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Mobile Number</label>
            <input
              type="tel"
              name="phone"
              className={styles.input}
              placeholder="Enter 10-digit mobile number"
              required
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              className={styles.input}
              placeholder="Enter your email address"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '12px' }}>{error}</p>
          )}

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Saving…' : 'Continue to Checkout'}
          </button>
        </form>

        <div className={styles.secureBadge}>
          <FaLock className={styles.secureIcon} />
          <span>Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactForm />
    </Suspense>
  );
}
