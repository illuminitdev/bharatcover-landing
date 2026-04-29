import type { Metadata } from 'next';
import { healthInsurancePageData } from '@/content/product-pages/health-insurance';
import Link from 'next/link';
import brainHeroImage from '@/public/images/brain-hero.png';
import HealthPremiumCalculator from './HealthPremiumCalculator';
import styles from './health-insurance.module.css';

const { seo } = healthInsurancePageData;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.openGraphTitle ?? seo.title,
    description: seo.openGraphDescription ?? seo.description,
  },
};

export default function HealthInsurancePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>Health Protection</div>
            <h1>
              Health cover for you and your
              <br />
              <span>whole family.</span>
            </h1>
            <p>
              Comprehensive cashless health insurance with hospitalisation cover,
              day care, pre &amp; post care across 6,000+ network hospitals.
            </p>
            <div className={styles.heroActions}>
              <Link href="/personal/contact" className={styles.primaryBtn}>
                Get covered now
              </Link>
              <Link href="/personal/contact" className={styles.secondaryBtn}>
                View premiums
              </Link>
            </div>
            <ul className={styles.heroPoints}>
              <li>Ages 18-65</li>
              <li>Cashless hospitals</li>
              <li>Pre &amp; post care</li>
              <li>Family floater</li>
            </ul>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroImageWrap}>
              <img src={brainHeroImage.src} alt="Health insurance hero" className={styles.heroImage} />
            </div>
            <div className={styles.priceTag}>
              <p>Starts from</p>
              <h4>
                <span>Rs</span>750
                <small>/year</small>
              </h4>
              <strong>Health Insurance</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.planTabs}>
        <button type="button" className={`${styles.planTab} ${styles.planTabActive}`}>
          Individual Plan <span>Bharat Arogya Individual</span>
        </button>
        <button type="button" className={styles.planTab}>
          Family Floater <span>Up to 2A+2C</span>
        </button>
      </section>

      <section className={styles.body}>
        <div>
          <article className={styles.card}>
            <h3>What&apos;s Covered</h3>
            <p className={styles.cardSubtext}>Core benefits included in the Bharat Arogya Individual plan</p>
            <div className={styles.coverGrid}>
              <div className={styles.coverItem}>
                <strong>In-Patient Hospitalization</strong>
                Up to Sum Insured for room, nursing, surgery, and all in-hospital medical expenses.
              </div>
              <div className={styles.coverItem}>
                <strong>Pre / Post Hospitalization</strong>
                30 days of medical expenses incurred before admission and diagnostics.
              </div>
              <div className={styles.coverItem}>
                <strong>Day Care Procedures</strong>
                Over 540 procedures covered with no 24-hour admission required.
              </div>
              <div className={styles.coverItem}>
                <strong>Ambulance Cover</strong>
                Up to Rs 2,000 per hospitalization for emergency ambulance charges.
              </div>
              <div className={styles.coverItem}>
                <strong>Post-Hospitalization</strong>
                60 days of follow-up care after discharge including medicines and doctor visits.
              </div>
              <div className={styles.coverItem}>
                <strong>Room Rent</strong>
                2% of SI/day for normal ward, 4% SI/day for ICU. Proportionate deduction applies if exceeded.
              </div>
            </div>
            <div className={styles.noteBanner}>
              <strong>Co-Pay</strong> 10% co-payment applicable on all claims. You bear 10% of admissible claim amount.
            </div>
          </article>

          <article className={styles.card}>
            <h3>Waiting Periods</h3>
            <p className={styles.cardSubtext}>Standard waiting periods applicable under this plan</p>
            <ul className={styles.simpleList}>
              <li>
                <span>Initial Waiting Period</span>
                <strong>30 Days</strong>
              </li>
              <li>
                <span>Pre-Existing Disease (PED)</span>
                <strong>24 Months</strong>
              </li>
              <li>
                <span>Specific Disease / Procedure</span>
                <strong>12 Months</strong>
              </li>
              <li>
                <span>Accidents</span>
                <strong>None - Day 1</strong>
              </li>
            </ul>
          </article>

          <article className={styles.card}>
            <h3>Premium at a Glance</h3>
            <p className={styles.cardSubtext}>Annual premium for individuals aged 18-65 years</p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sum Insured</th>
                  <th>Base Premium</th>
                  <th>With GST (18%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rs 1,00,000</td>
                  <td>Rs 750 / yr</td>
                  <td>Rs 885 / yr</td>
                </tr>
                <tr>
                  <td>Rs 2,00,000</td>
                  <td>Rs 1,050 / yr</td>
                  <td>Rs 1,239 / yr</td>
                </tr>
                <tr>
                  <td>Rs 3,00,000</td>
                  <td>Rs 1,250 / yr</td>
                  <td>Rs 1,475 / yr</td>
                </tr>
                <tr>
                  <td>Rs 5,00,000</td>
                  <td>Rs 2,050 / yr</td>
                  <td>Rs 2,419 / yr</td>
                </tr>
              </tbody>
            </table>
            <div className={styles.gstNote}>
              GST Note: GST exemption on individual health plans was announced in Sep 2025. Check latest applicable rates.
            </div>
          </article>

          <article className={styles.card}>
            <h3>Frequently Asked Questions</h3>
            <div className={styles.faqItem}>What does &apos;co-pay&apos; mean in this plan?</div>
            <div className={styles.faqItem}>Which hospitals are in the cashless network?</div>
            <div className={styles.faqItem}>Is day care treatment covered?</div>
            <div className={styles.faqItem}>What is room rent capping and how does it affect my claim?</div>
            <div className={styles.faqItem}>Can I port my existing health policy to Bharat Arogya?</div>
          </article>
        </div>

        <aside>
          <HealthPremiumCalculator />

          <article className={styles.trustStrip}>
            <h4>Why BharatCover</h4>
            <div className={styles.trustItems}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>✅</span> Magma General Insurance backed
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🏥</span> Cashless at 10,000+ hospitals
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>💊</span> Day Care — 540+ procedures
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🛡️</span> IRDAI Regulated
              </div>
            </div>
          </article>
          <article className={styles.card}>
            <h3>Related Products</h3>
            <ul className={styles.relatedList}>
              <li className={styles.relatedListActive}>
                <span className={styles.relatedIcon}></span>
                <div>
                  <b>Bharat Arogya Family Floater</b>
                  <span>Shared SI for the whole family</span>
                </div>
              </li>
              <li>
                <span className={styles.relatedIcon}></span>
                <div>
                  <b>Bharat Suraksha Accident</b>
                  <span>Personal Accident cover from ₹24/yr</span>
                </div>
              </li>
              <li>
                <span className={styles.relatedIcon}></span>
                <div>
                  <b>Bharat Suraksha Daily Cash</b>
                  <span>Hospital daily cash rider</span>
                </div>
              </li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
