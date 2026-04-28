'use client';

import { useState } from 'react';
import styles from './HealthQuoteClient.module.css';

export default function HealthQuoteClient() {
  const [gstEnabled, setGstEnabled] = useState(true);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.planTag}>Bharat Arogya Individual Plan</p>
            <h1 className={styles.heroTitle}>Bharat Arogya Individual Plan</h1>
            <p className={styles.heroSubtitle}>Start your policy application in 3 easy steps</p>
            <div className={styles.heroChips}>
              <span className={styles.chip}>Personal Details</span>
              <span className={styles.chip}>Nominee</span>
              <span className={styles.chip}>Review & Confirm</span>
            </div>
          </div>
          <div className={styles.heroPrice}>
            <p>Annual Premium</p>
            <strong>Rs 1,250</strong>
          </div>
        </div>
      </section>

      <section className={styles.progressWrap}>
        <div className={styles.progressItemActive}>Proposer Details</div>
        <div className={styles.progressItem}>Nominee Details</div>
        <div className={styles.progressItem}>Review & Confirm</div>
      </section>

      <section className={styles.content}>
        <div className={styles.left}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Proposer Details</h2>
            <div className={styles.formGrid}>
              <Field label="Title *" value="Mr" />
              <Field label="First Name *" value="Ramesh" />
              <Field label="Last Name *" value="Kumar" />
              <Field label="Date of Birth *" value="12/07/1989" />
              <Field label="Gender *" value="Male" />
              <Field label="Mobile *" value="+91 98765 43210" />
              <Field label="Email *" value="ramesh@example.com" />
              <Field label="Address Line 1 *" value="Flat 202, Lakshmi Residency" />
              <Field label="City *" value="Hyderabad" />
              <Field label="State *" value="Telangana" />
              <Field label="Pincode *" value="500033" />
              <Field label="Occupation *" value="Salaried" />
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Nominee Details</h2>
            <div className={styles.formGrid}>
              <Field label="Nominee Name *" value="Sita Kumari" />
              <Field label="Relationship *" value="Spouse" />
              <Field label="Nominee DOB *" value="05/11/1991" />
              <Field label="Nominee Phone" value="+91 91234 56789" />
            </div>
          </div>

          <button type="button" className={styles.continueBtn}>
            Continue to Secure Checkout
          </button>
        </div>

        <aside className={styles.right}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Your Premium Details</h3>
            <div className={styles.summaryPrice}>Rs 1,250</div>
            <div className={styles.summaryRows}>
              <Row label="Base Premium" value="Rs 1,059" />
              <Row label="GST (18%)" value="Rs 191" />
              <Row label="Policy Tenure" value="1 Year" />
            </div>
            <div className={styles.totalRow}>
              <span>Total Payable</span>
              <strong>Rs 1,250</strong>
            </div>
            <label className={styles.toggleRow}>
              <span>Include GST Breakdown</span>
              <button
                type="button"
                className={`${styles.toggle} ${gstEnabled ? styles.toggleOn : ''}`}
                onClick={() => setGstEnabled((v) => !v)}
                aria-label="Toggle GST breakdown"
              >
                <span />
              </button>
            </label>
            {!gstEnabled ? <p className={styles.toggleNote}>Showing final premium only.</p> : null}
          </div>

          <div className={styles.whyCard}>
            <h3 className={styles.whyTitle}>Why BharatCover</h3>
            <ul>
              <li>Trusted insurer network</li>
              <li>Transparent premium breakup</li>
              <li>Dedicated claim support</li>
              <li>Secure digital checkout</li>
            </ul>
            <a className={styles.helpCta} href="tel:+917680064255">
              Need help? +91 76800 64255
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input value={value} readOnly />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
