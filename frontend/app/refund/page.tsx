import type { Metadata } from 'next';
import styles from './refund.module.css';

export const metadata: Metadata = {
  title: 'Refund Policy — BharatCover',
  description:
    'Refunds are available within 7 days of purchase, before using any services, after deduction of applicable administrative charges.',
};

export default function RefundPolicyPage() {
  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroTag}>LEGAL</span>
          <h1 className={styles.heroTitle}>Refund Policy</h1>
          <p className={styles.heroSub}>
            Refunds are available within 7 days of purchase, before using any services,
            after deduction of applicable administrative charges.
          </p>
          <p className={styles.heroMeta}>Effective Date: 01 January 2026 · Updated: 01 January 2026</p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <main className={styles.contentWrap}>
        <div className={styles.contentInner}>

          {/* Summary tiles */}
          <div className={styles.summaryStrip}>
            <div className={styles.summaryTile}>
              <div className={styles.tileIcon}>📅</div>
              <div className={styles.tileValue}>7 Days</div>
              <div className={styles.tileLabel}>Refund window from purchase</div>
            </div>
            <div className={styles.summaryTile}>
              <div className={styles.tileIcon}>🚫</div>
              <div className={styles.tileValue}>0 Services</div>
              <div className={styles.tileLabel}>Must not have used any services</div>
            </div>
            <div className={styles.summaryTile}>
              <div className={styles.tileIcon}>💸</div>
              <div className={styles.tileValue}>Less Admin</div>
              <div className={styles.tileLabel}>Membership fee less administrative charges</div>
            </div>
          </div>

          {/* Section 1 */}
          <article className={styles.sectionCard}>
            <h2>1. Our Refund Commitment</h2>
            <div className={styles.greenBox}>
              If you purchase a BharatCover Membership and change your mind — for any reason — you may
              request a refund within <strong>7 days of purchase</strong>, provided you have not used
              any services included in the membership. The refund will be the membership fee paid{' '}
              <strong>less applicable administrative charges</strong>.
            </div>
            <p>
              We believe in transparency and fairness. No complicated process, no questions asked —
              as long as the conditions below are met. Please note that administrative charges will be
              deducted from the refund amount to cover payment processing and handling costs.
            </p>
          </article>

          {/* Section 2 */}
          <article className={styles.sectionCard}>
            <h2>2. Eligibility Conditions</h2>
            <p>
              A refund will be issued if <strong>all</strong> of the following conditions are satisfied:
            </p>
            <ul>
              <li>Your refund request is submitted <strong>within 7 calendar days</strong> of the date of purchase.</li>
              <li>You have <strong>not used any teleconsultation</strong> session via the zAppy Network.</li>
              <li>You have <strong>not redeemed any diagnostic, radiology or specialist discount</strong> via the zAppy Network.</li>
              <li>Your <strong>insurance policy has not been activated</strong>, or if activated, <strong>no claim has been filed</strong> under it.</li>
              <li>The request is made by the same person who purchased the membership, using the registered email address.</li>
            </ul>
            <div className={styles.warnBox}>
              Once any service has been accessed — even a single teleconsultation or a redeemed
              diagnostic discount — the membership is considered used and is no longer eligible for
              this 7-day refund.
            </div>
            <h3>Quick Eligibility Reference</h3>
            <div className={styles.tableWrap}>
              <table className={styles.eligTable}>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Refund Eligible?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Within 7 days, no services used, change of mind</td>
                    <td><span className={styles.tagYes}>✓ Yes — Less Admin Charges</span></td>
                  </tr>
                  <tr>
                    <td>Within 7 days, no services used, not satisfied with terms</td>
                    <td><span className={styles.tagYes}>✓ Yes — Less Admin Charges</span></td>
                  </tr>
                  <tr>
                    <td>Within 7 days, but 1 teleconsultation used</td>
                    <td><span className={styles.tagNo}>✗ Not Eligible</span></td>
                  </tr>
                  <tr>
                    <td>Within 7 days, but diagnostic discount redeemed</td>
                    <td><span className={styles.tagNo}>✗ Not Eligible</span></td>
                  </tr>
                  <tr>
                    <td>After 7 days, no services used</td>
                    <td><span className={styles.tagNo}>✗ Not Eligible</span></td>
                  </tr>
                  <tr>
                    <td>Insurance policy activated, no claim filed, within 15 days</td>
                    <td><span className={styles.tagOther}>See Free-Look Period (Section 5)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          {/* Section 3 */}
          <article className={styles.sectionCard}>
            <h2>3. How to Request a Refund</h2>
            <div className={styles.stepsList}>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepBody}>
                  <strong>Email us at <a href="mailto:hello@bharatcover.net">hello@bharatcover.net</a></strong>
                  <span>Use the subject line: <em>&quot;Refund Request — [Your Name]&quot;</em></span>
                </div>
              </div>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepBody}>
                  <strong>Include in your email:</strong>
                  <span>
                    Your full name · Registered email address · Membership/order reference number ·
                    Reason for refund (optional — genuinely no questions asked, but it helps us improve)
                  </span>
                </div>
              </div>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepBody}>
                  <strong>We acknowledge within 1 business day</strong>
                  <span>We will confirm receipt of your request and verify eligibility within 1 working day.</span>
                </div>
              </div>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>4</div>
                <div className={styles.stepBody}>
                  <strong>Refund processed within 7–10 business days</strong>
                  <span>
                    The refund will be credited to the original payment method (credit/debit card, UPI,
                    net banking). Bank processing times may vary.
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Section 4 */}
          <article className={styles.sectionCard}>
            <h2>4. Refund Amount</h2>
            <p>
              If eligible, the refund will be the{' '}
              <strong>membership fee paid less applicable administrative charges</strong>. Administrative
              charges cover payment gateway processing fees, handling costs and related expenses incurred
              at the time of the original transaction.
            </p>
            <ul>
              <li>The administrative charges deducted will be communicated to you at the time your refund request is acknowledged.</li>
              <li>Any GST on the retained administrative charges will be as per applicable tax regulations and will not be separately refunded.</li>
              <li>The net refund amount (after deduction of administrative charges) will be credited to the original payment instrument only. We cannot issue refunds to a different account or payment method.</li>
              <li>If the administrative charges exceed the membership fee paid (for example, on very low-value transactions), no refund will be payable.</li>
            </ul>
            <div className={styles.highlight}>
              If your payment was processed via a third-party payment gateway, the refund timeline may
              depend on the gateway and your bank. BharatCover initiates the refund promptly — any
              delay beyond 10 business days is typically at the bank&apos;s end.
            </div>
          </article>

          {/* Section 5 */}
          <article className={styles.sectionCard}>
            <h2>5. Insurance Free-Look Period (Separate from This Policy)</h2>
            <p>
              The 7-day refund policy above applies to the <strong>BharatCover Membership fee</strong>.
              Insurance policies issued as part of a membership are subject to a separate{' '}
              <strong>15-day free-look period</strong> as mandated by IRDAI:
            </p>
            <ul>
              <li>The free-look period is <strong>15 days from the date of receipt</strong> of the insurance policy document.</li>
              <li>During the free-look period you may return the policy to the insurer if not satisfied.</li>
              <li>The insurance premium refunded under free-look will be the premium paid <strong>less</strong> a pro-rata amount for days of risk covered and any stamp duty charges — as per IRDAI regulations.</li>
              <li>To exercise the free-look option on an insurance policy, contact us at <a href="mailto:hello@bharatcover.net">hello@bharatcover.net</a> and we will facilitate the process with the insurer.</li>
            </ul>
            <div className={styles.highlight}>
              Free-look period refunds on insurance premiums are processed by the insurer
              (SBI General / Magma General / Go Digit), not by BharatCover. Our role is to
              facilitate the request on your behalf.
            </div>
          </article>

          {/* Section 6 */}
          <article className={styles.sectionCard}>
            <h2>6. Non-Refundable Situations</h2>
            <p>A refund will <strong>not</strong> be issued in any of the following situations:</p>
            <ul>
              <li>The refund request is submitted after the 7-day window has elapsed.</li>
              <li>Any wellness service (teleconsultation, diagnostic discount, radiology discount, specialist discount) has been used.</li>
              <li>A claim has been filed under the associated insurance policy.</li>
              <li>The membership was purchased as part of a group or institutional arrangement — please refer to the terms of your group agreement.</li>
              <li>The membership was gifted to you — the refund, if applicable, will be processed to the original purchaser&apos;s payment method.</li>
            </ul>
          </article>

          {/* Section 7 */}
          <article className={styles.sectionCard}>
            <h2>7. Disputes</h2>
            <p>
              If you believe your refund request was incorrectly denied, you may escalate to our
              Grievance Officer:
            </p>
            <ul>
              <li>Email: <a href="mailto:grievance@bharatcover.net">grievance@bharatcover.net</a></li>
              <li>We will acknowledge within 3 working days and resolve within 15 working days.</li>
              <li>If still unresolved, escalate to IRDAI at <a href="https://igms.irda.gov.in" target="_blank" rel="noopener">igms.irda.gov.in</a> or call <strong>Bima Bharosa: 155255</strong>.</li>
            </ul>
          </article>

          {/* Section 8 */}
          <article className={styles.sectionCard}>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Refund Policy from time to time. Any changes will be posted on this
              page with an updated effective date. The policy in effect at the time of your purchase
              will apply to any refund request.
            </p>
          </article>

          {/* Section 9 */}
          <article className={styles.sectionCard}>
            <h2>9. Contact</h2>
            <p>BharatCover Insurance Intermediary</p>
            <p>VS Enterprises, Hyderabad, Telangana, India</p>
            <p>Email: <a href="mailto:hello@bharatcover.net">hello@bharatcover.net</a></p>
            <p>IRDAI Licence No: [To be updated]</p>
          </article>

        </div>
      </main>
    </div>
  );
}