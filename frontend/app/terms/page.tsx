import type { Metadata } from 'next';
import styles from './terms.module.css';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for BharatCover Insurance Brokers Pvt. Ltd.',
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroTag}>LEGAL</span>
          <h1 className={styles.heroTitle}>Terms of Use</h1>
          <p className={styles.heroSub}>
            Please review the terms governing access to and use of BharatCover services.
          </p>
          <p className={styles.heroMeta}>Effective Date: 01 January 2026 · Updated: 28 April 2026</p>
        </div>
      </section>

      <main className={styles.contentWrap}>
        <div className={styles.contentInner}>
          <article className={styles.sectionCard}>
            <h2>1. About BharatCover</h2>
            <p>
              BharatCover Insurance Brokers Pvt. Ltd. is an IRDAI-registered insurance intermediary
              offering insurance advisory and distribution services for individuals and businesses.
            </p>
            <div className={styles.highlight}>
              By accessing our website or using our services, you agree to these Terms of Use.
            </div>
          </article>

          <article className={styles.sectionCard}>
            <h2>2. Nature of Our Services</h2>
            <ul>
              <li>Insurance advisory, comparison, and policy facilitation services.</li>
              <li>Assistance in proposal submission, underwriting, and renewals.</li>
              <li>Claims support coordination with insurers and TPAs.</li>
            </ul>
            <p>
              Final policy issuance and claims decision remain subject to the insurer’s terms and
              underwriting guidelines.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>3. Accuracy of Information</h2>
            <p>
              You must provide complete and accurate information. Incorrect or misleading details may
              impact quote accuracy, policy issuance, or claim outcomes.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>4. User Responsibilities</h2>
            <ul>
              <li>Use this website only for lawful and genuine business purposes.</li>
              <li>Do not misuse platform content, services, or communication channels.</li>
              <li>Maintain confidentiality of any account credentials you use.</li>
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>5. IRDAI and Regulatory Compliance</h2>
            <p>
              BharatCover operates in accordance with applicable Indian laws and IRDAI regulations.
              Insurance products are underwritten by licensed insurers and governed by respective
              policy wordings.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>6. Free-Look Period</h2>
            <p>
              Eligible policies may include a free-look period in line with insurer terms and IRDAI
              norms, allowing cancellation under specified conditions.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>7. Premiums and Payments</h2>
            <ul>
              <li>Premiums are determined by insurers based on submitted risk details.</li>
              <li>Policy benefits commence only after successful payment and issuance.</li>
              <li>Taxes, levies, and charges apply as per prevailing regulations.</li>
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h2>8. Intellectual Property</h2>
            <p>
              All website content, branding, and design elements are protected intellectual property of
              BharatCover and may not be copied or reused without permission.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>9. Limitation of Liability</h2>
            <p>
              BharatCover acts as an intermediary. We are not liable for insurer underwriting decisions,
              policy exclusions, claim repudiations, or consequential losses arising from third-party
              actions.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>10. Grievance Redressal</h2>
            <p>Email: support@bharatcover.net</p>
            <p>Phone: +91 76800 64255</p>
          </article>

          <article className={styles.sectionCard}>
            <h2>11. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Jurisdiction for disputes will be as
              applicable under law.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>12. Changes to These Terms</h2>
            <p>
              We may update these terms periodically. Continued use of our services after updates
              constitutes acceptance of revised terms.
            </p>
          </article>

          <article className={styles.sectionCard}>
            <h2>13. Contact</h2>
            <p>BharatCover Insurance Brokers Pvt. Ltd.</p>
            <p>Email: support@bharatcover.net</p>
            <p>Phone: +91 76800 64255</p>
          </article>
        </div>
      </main>
    </div>
  );
}
