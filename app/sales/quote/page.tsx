'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheck, FaShieldAlt, FaShoppingCart } from 'react-icons/fa';
import { createGuestSessionAndStore } from '@/lib/guest-api';
import {
  getPaOptionForSi,
  parseGstQuery,
  parseSiQuery,
  siToProductSlug,
} from '@/lib/pa-quote';
import styles from './quote.module.css';

const FEATURES = [
  'No medical checkup required — issuance in minutes',
  '24/7 worldwide coverage for accidental death & disability',
  'AD + PTD + PPD as per insurer schedule of benefits',
  'Pan-India cashless network via partner insurers',
];

function QuotePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paSI = parseSiQuery(searchParams.get('si'));
  const includeGstPa = parseGstQuery(searchParams.get('gst'));
  const opt = getPaOptionForSi(paSI) ?? {
    amt: paSI,
    label: '',
    base: 0,
    gst: 0,
    short: '',
  };
  const paBasePrem = opt.base;
  const paGstPrem = opt.gst;

  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const annual = includeGstPa ? paGstPrem : paBasePrem;
  const perMonth = (annual / 12).toFixed(2);
  const gstAmount = includeGstPa ? paGstPrem - paBasePrem : 0;

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className={styles.sep}>›</span>
        <Link href="/sales">Personal Insurance</Link>
        <span className={styles.sep}>›</span>
        <span className={styles.current}>Instant quote</span>
      </nav>

      <div className={styles.grid}>
        <div className={styles.backRow}>
          <Link href="/sales" className={styles.backLink}>
            ← Back to calculator
          </Link>
        </div>

        <article className={styles.productCard} aria-labelledby="quote-product-title">
          <header className={styles.cardHeader}>
            <div className={styles.cardHeaderTop}>
              <div className={styles.iconBox} aria-hidden>
                <FaShieldAlt />
              </div>
              <span className={styles.statusBadge}>Selected</span>
            </div>
            <h1 id="quote-product-title" className={styles.cardTitle}>
              Personal Accident Cover
            </h1>
            <p className={styles.cardSubtitle}>Personal insurance · Plan 1A</p>
          </header>

          <p className={styles.serviceHint}>Annual policy · Unit rate (ages 18–65)</p>

          <div className={styles.detailTable}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Premium</span>
              <span className={styles.detailValuePremium}>₹{annual.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Coverage (sum insured)</span>
              <span className={styles.detailValue}>
                ₹{paSI.toLocaleString('en-IN')}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Base premium</span>
              <span className={styles.detailValueMuted}>₹{paBasePrem} / yr</span>
            </div>
            {includeGstPa && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>GST (18%)</span>
                <span className={styles.detailValueMuted}>₹{gstAmount}</span>
              </div>
            )}
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Tenure</span>
              <span className={styles.detailValueMuted}>1 year</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Equiv. per month</span>
              <span className={styles.detailValueMuted}>₹{perMonth}</span>
            </div>
          </div>

          <div className={styles.featuresSection}>
            <h2 className={styles.featuresHeading}>Key features</h2>
            <ul className={styles.featureList}>
              {FEATURES.map((text) => (
                <li key={text} className={styles.featureItem}>
                  <FaCheck className={styles.checkIcon} aria-hidden />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <footer className={styles.cardFooter}>
            <Link href="/sales" className={styles.btnOutline}>
              Change plan
            </Link>
            <Link href="/sales" className={styles.btnPrimary}>
              View benefits
            </Link>
          </footer>
        </article>

        <aside className={styles.formPanel}>
          <div className={styles.formPanelHeader}>
            <h2 className={styles.formPanelTitle}>Complete purchase</h2>
            <span className={styles.formBadge}>Secure</span>
          </div>
          <p className={styles.formIntro}>
            Enter your contact details. You will continue to payment on the next step.
          </p>
          <form
            className={styles.form}
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              const mob = mobile.replace(/\D/g, '').slice(-10);
              if (!/^\d{10}$/.test(mob)) {
                setError('Enter a valid 10-digit mobile number.');
                return;
              }
              const em = email.trim();
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
                setError('Enter a valid email address.');
                return;
              }
              const slug = siToProductSlug(paSI);
              setSubmitting(true);
              try {
                const result = await createGuestSessionAndStore({
                  productId: slug,
                  phone: mob,
                  email: em,
                });
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                router.push(`/sales/checkout?product=${encodeURIComponent(slug)}`);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <label className={styles.fieldLabel} htmlFor="quote-mobile">
              Mobile number
            </label>
            <input
              id="quote-mobile"
              className={styles.fieldInput}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit mobile"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            <label className={styles.fieldLabel} htmlFor="quote-email">
              Email address
            </label>
            <input
              id="quote-email"
              className={styles.fieldInput}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <p className={styles.formError} role="alert">
                {error}
              </p>
            )}
            <div className={styles.submitRow}>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                <FaShoppingCart aria-hidden />
                {submitting ? 'Starting checkout…' : 'Continue to checkout'}
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}

export default function SalesQuotePage() {
  return (
    <Suspense fallback={<div className={styles.page}><div className={styles.loadingFallback}>Loading…</div></div>}>
      <QuotePageContent />
    </Suspense>
  );
}
