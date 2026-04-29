import type { Metadata } from 'next';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for BharatCover Insurance Brokers Pvt. Ltd.',
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroTag}>LEGAL</span>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSub}>
            Learn how BharatCover collects, uses, protects, and manages your personal information.
          </p>
          <p className={styles.heroMeta}>Effective Date: 01 January 2026 · Updated: 28 April 2026</p>
        </div>
      </section>

      <main className={styles.contentWrap}>
        <div className={styles.contentInner}>
          <article className={styles.sectionCard}>
            <h2>1. Who We Are</h2>
            <p>
             BharatCover is an IRDAI-regulated wellness distribution platform offering plans underwritten by Magma General Insurance, SBI General Insurance, and Go Digit General Insurance.
            </p>
            <p>
              This Privacy Policy explains what data we collect, why we collect it, and how we use
              and protect it when you visit our website or engage with our services.
            </p>
            <div className={styles.highlight}>
              This policy applies to all users of BharatCover digital platforms and contact channels.
            </div>
          </article>

          <article className={styles.sectionCard}>
            <h2>2. Information We Collect</h2>
            <h3>Information you provide directly</h3>
            <ul>
              <li>Full name, phone number, email address, and contact details.</li>
              <li>Business profile, employee count, and insurance requirements.</li>
              <li>Any details shared in forms, calls, or support interactions.</li>
            </ul>
            <h3>Information collected automatically</h3>
            <ul>
              <li>Device and browser information, IP address, and session data.</li>
              <li>Pages visited, referring sources, and interaction analytics.</li>
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To provide quotes, policy servicing, and customer support.</li>
              <li>To communicate proposal status, renewals, and service updates.</li>
              <li>To improve platform performance, security, and user experience.</li>
              <li>To comply with legal and regulatory obligations.</li>
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>4. Sharing of Information</h2>
            <p>We may share limited information with:</p>
            <ul>
              <li>Insurers and TPAs for quote generation and policy administration.</li>
              <li>Technology and support partners under strict confidentiality.</li>
              <li>Authorities when required by law, court, or regulation.</li>
            </ul>
            <p>We do not sell your personal data.</p>
          </article>

          <article className={styles.sectionCard}>
            <h2>5. Data Retention</h2>
            <p>
              We retain personal information only for as long as necessary to deliver services, meet
              legal obligations, resolve disputes, and enforce agreements.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>6. Cookies</h2>
            <p>
              We use cookies and similar technologies for essential website functions, analytics, and
              service improvements. You can manage cookie settings through your browser.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>7. Your Rights (DPDP Act 2023)</h2>
            <ul>
              <li>Right to access and review your personal information.</li>
              <li>Right to correction, update, or erasure (where applicable).</li>
              <li>Right to grievance redressal and withdrawal of consent.</li>
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>8. Data Security</h2>
            <p>
              We implement reasonable technical and organizational safeguards, including encryption,
              access controls, and secure infrastructure practices.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>9. Grievance Officer - Privacy</h2>
            <p>Email: privacy@bharatcover.net</p>
            <p>Phone: +91 76800 64255</p>
          </article>

          <article className={styles.sectionCard}>
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this policy periodically. Updates will be posted on this page with a
              revised effective date.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>11. Contact Us</h2>
            <p>BharatCover Insurance Brokers Pvt. Ltd.</p>
            <p>Email: support@bharatcover.net</p>
            <p>Phone: +91 76800 64255</p>
          </article>
        </div>
      </main>
    </div>
  );
}
