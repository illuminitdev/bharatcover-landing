import type { Metadata } from 'next';
import { PA_SI_OPTIONS } from '@/lib/pa-quote';
import AccidentPremiumCalculator from './AccidentPremiumCalculator';
import AccidentFaq from './AccidentFaq';
import styles from './accident.module.css';

export const metadata: Metadata = {
  title: 'Bharat Suraksha — Personal Accident Cover',
  description:
    'Simple, affordable annual accident cover for individuals and families. Choose the sum insured that fits your budget and get guidance from BharatCover advisors.',
  openGraph: {
    title: 'Bharat Suraksha — Personal Accident Cover',
    description:
      'Annual Personal Accident insurance with AD, PTD and PPD benefits. Premiums starting at ₹24/year for ₹1 Lakh cover.',
  },
};

const COVERAGE_ITEMS = [
  {
    title: 'Accidental Death (AD)',
    desc: 'Full sum insured paid to nominee in the event of death caused directly by an accident.',
  },
  {
    title: 'Permanent Total Disability (PTD)',
    desc: '100% sum insured paid for loss of both limbs, both eyes, or one limb + one eye due to accident.',
  },
  {
    title: 'Permanent Partial Disability (PPD)',
    desc: 'Proportionate benefit as per the Schedule of Benefits — loss of specific limbs or sensory organs.',
  },
  {
    title: '24/7 Worldwide Coverage',
    desc: 'Coverage is active round-the-clock — at work, at home, travelling — anywhere in the world.',
  },
];

const EXCLUSIONS = [
  {
    icon: '🩺',
    title: 'Illness or Disease',
    desc: 'Death or disability caused by sickness, medical conditions, or natural diseases is not covered — only accidents qualify.',
  },
  {
    icon: '🍺',
    title: 'Alcohol or Drug Influence',
    desc: 'Claims arising when the insured was under the influence of alcohol, narcotics, or any intoxicating substance at the time of accident.',
  },
  {
    icon: '⚠️',
    title: 'Self-Inflicted Injury',
    desc: 'Intentional self-harm, attempted suicide, or any deliberate bodily injury — irrespective of mental state at the time.',
  },
  {
    icon: '⚖️',
    title: 'Criminal or Illegal Activity',
    desc: 'Accidents occurring while the insured is engaged in any criminal or unlawful act, including participation in riots.',
  },
  {
    icon: '✈️',
    title: 'Aviation (Non-Commercial)',
    desc: 'Injuries during private flying, skydiving, paragliding or air sports are excluded. Scheduled commercial passenger flights are covered.',
  },
  {
    icon: '🌊',
    title: 'Hazardous Activities',
    desc: 'Motor racing, mountaineering above 6,000 ft, bungee jumping, and professional extreme sports are excluded from cover.',
  },
  {
    icon: '🪖',
    title: 'War & Terrorism',
    desc: 'Any loss arising from war (declared or undeclared), invasion, revolution, nuclear, biological, or chemical events.',
  },
  {
    icon: '🦠',
    title: 'Pre-existing Disability',
    desc: 'Any disability or condition that existed before the policy inception date is not eligible for PA claim benefits.',
  },
];

const WHY_ITEMS = [
  {
    title: "India's Most Affordable PA",
    desc: '₹24/year for ₹1 Lakh cover — less than a cup of tea per month for full accident protection.',
  },
  {
    title: 'No Age Loading',
    desc: "Flat unit rate — whether you're 18 or 65, you pay the same premium. Fair pricing for everyone.",
  },
  {
    title: 'SBI General Backed',
    desc: "One of India's most trusted and claim-paying insurers — backed by State Bank of India group.",
  },
  {
    title: 'Instant Policy Issuance',
    desc: 'Digital policy document delivered within minutes. No paperwork, no hassle.',
  },
];

function CheckSvg() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function AccidentPage() {
  return (
    <div className={styles.page}>
      {/* PAGE HERO */}
      <section className={styles.pageHero}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <div>
              <div className={styles.heroTag}>
                Bharat Suraksha &nbsp;·&nbsp; Personal Accident Cover
              </div>
              <h1 className={styles.heroHeadline}>
                Accident cover that
                <br />
                protects your
                <br />
                <em>family&apos;s income.</em>
              </h1>
              <div className={styles.heroProductName}>
                Bharat Suraksha — Personal Accident Cover
              </div>
              <p className={styles.heroDesc}>
                Simple, affordable annual accident cover for individuals and families.
                Choose the sum insured that fits your budget and get guidance from
                BharatCover advisors.
              </p>
              <div className={styles.heroBtns}>
                <a href="#pa-quote" className={styles.btnHeroPrimary}>
                  Get covered now
                </a>
                <a href="#pa-premiums" className={styles.btnHeroOutline}>
                  View premiums
                </a>
              </div>
              <div className={styles.heroTrustChips}>
                <span className={styles.htc}>
                  <span className={styles.htcCheck}>✓</span> 18–65 years
                </span>
                <span className={styles.htc}>
                  <span className={styles.htcCheck}>✓</span> 1-year policy
                </span>
                <span className={styles.htc}>
                  <span className={styles.htcCheck}>✓</span> GST included
                </span>
                <span className={styles.htc}>
                  <span className={styles.htcCheck}>✓</span> Individual &amp; group use
                </span>
              </div>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.heroVisual}>
                <div className={styles.heroVisualFallback}>
                  <div className={styles.heroVisualShield}>🛡️</div>
                  <div className={styles.heroVisualLabel}>Personal Accident Cover</div>
                </div>
              </div>
              <div className={styles.heroPriceCard}>
                <div className={styles.hpcLabel}>Starts From</div>
                <div className={styles.hpcPrice}>
                  <span className={styles.hpcRupee}>₹</span>299
                  <span className={styles.hpcPer}>/year</span>
                </div>
                <div className={styles.hpcPlan}>Personal Accident Cover</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT TABS */}
      <div className={styles.prodTabBar}>
        <div className={styles.tabInner}>
          <div className={`${styles.prodTab} ${styles.prodTabActive}`}>
            🛡️ Personal Accident Cover
            <span className={styles.tabBadge}>Bharat Suraksha · SBI General</span>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className={styles.layout}>
        <div>
          {/* COVERAGE BENEFITS */}
          <div className={styles.sectionCard}>
            <div className={styles.cardTitle}>
              <div className={`${styles.cardTitleIcon} ${styles.iconSage}`}>✅</div>
              <div>
                <h2>What&apos;s Covered</h2>
                <p>Core benefits included in all Personal Accident plans</p>
              </div>
            </div>
            <div className={styles.coverageGrid}>
              {COVERAGE_ITEMS.map((item) => (
                <div key={item.title} className={styles.covItem}>
                  <div className={styles.covCheck}>
                    <CheckSvg />
                  </div>
                  <div className={styles.covText}>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.highlightNote}>
              <span className={styles.hnIcon}>💡</span>
              <span>
                No waiting period applies on Personal Accident plans. Coverage begins
                from Day 1 of the policy. No pre-medical examination required for sum
                insured up to ₹15 Lakh.
              </span>
            </div>
          </div>

          {/* PREMIUM TABLE */}
          <div className={styles.sectionCard} id="pa-premiums">
            <div className={styles.cardTitle}>
              <div className={`${styles.cardTitleIcon} ${styles.iconIndigo}`}>₹</div>
              <div>
                <h2>Premium at a Glance</h2>
                <p>
                  Annual premium across all sum insured options — unit rate for ages
                  18–65
                </p>
              </div>
            </div>
            <table className={styles.premiumTable}>
              <thead>
                <tr>
                  <th>Sum Insured</th>
                  <th>Coverage</th>
                  <th>Base Premium</th>
                  <th>Premium + GST (18%)</th>
                </tr>
              </thead>
              <tbody>
                {PA_SI_OPTIONS.map((opt) => (
                  <tr key={opt.amt}>
                    <td>
                      <span className={styles.siVal}>
                        ₹{opt.amt.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className={styles.coverageNote}>AD + PTD + PPD</td>
                    <td>
                      <span className={styles.premVal}>₹{opt.base} / yr</span>
                    </td>
                    <td>
                      <span className={styles.premGst}>₹{opt.gst} / yr</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={styles.tableNote}>
              ⚡ <strong>Unit Rate</strong> — same premium applies to all ages between
              18 and 65 years. GST at 18% is applicable on the base premium. Premiums
              are for individual annual policies.
            </p>
          </div>

          {/* WHAT IS NOT COVERED */}
          <div className={styles.sectionCard}>
            <div className={styles.cardTitle}>
              <div className={`${styles.cardTitleIcon} ${styles.iconRed}`}>🚫</div>
              <div>
                <h2>What is Not Covered</h2>
                <p>Exclusions that apply to Personal Accident policies</p>
              </div>
            </div>
            <div className={styles.exclGrid}>
              {EXCLUSIONS.map((item) => (
                <div key={item.title} className={styles.exclItem}>
                  <div className={styles.exclIcon}>{item.icon}</div>
                  <div className={styles.exclText}>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.exclNote}>
              <span>📋</span> For the complete exclusions list, refer to the{' '}
              <a
                href="https://www.sbigeneral.com"
                target="_blank"
                rel="noreferrer"
                className={styles.policyLink}
              >
                SBI General Policy Wordings
              </a>{' '}
              available on the insurer&apos;s website.
            </div>
          </div>

          {/* REAL-LIFE EXAMPLE */}
          <div className={styles.sectionCard}>
            <div className={styles.cardTitle}>
              <div className={`${styles.cardTitleIcon} ${styles.iconSage}`}>💡</div>
              <div>
                <h2>Real-life Example</h2>
                <p>How Bharat Suraksha PA Cover works when you need it most</p>
              </div>
            </div>
            <div className={styles.exampleStory}>
              <div className={styles.storyProfile}>
                <div className={styles.storyAvatar}>👷</div>
                <div>
                  <div className={styles.storyName}>Rajan Kumar, 35</div>
                  <div className={styles.storyRole}>
                    Construction Supervisor · Bengaluru
                  </div>
                </div>
                <div className={styles.storyPolicyBadge}>
                  Bharat Suraksha PA · ₹10 Lakh SI
                </div>
              </div>
              <div className={styles.storyIncident}>
                <div className={styles.storyIncidentLabel}>🔴 What happened</div>
                <p>
                  While inspecting a construction site, Rajan slipped from scaffolding
                  and fractured his right wrist. Due to complications, he permanently
                  lost 60% mobility of his dominant hand — classified as Permanent
                  Partial Disability (PPD) under his SBI General PA policy.
                </p>
              </div>
              <div className={styles.storyOutcome}>
                <div className={styles.storyOutcomeLabel}>
                  ✅ What Bharat Suraksha paid
                </div>
                <div className={styles.storyCalc}>
                  <div className={styles.calcRow}>
                    <span className={styles.calcKey}>Sum Insured</span>
                    <span className={styles.calcVal}>₹10,00,000</span>
                  </div>
                  <div className={styles.calcRow}>
                    <span className={styles.calcKey}>
                      PPD Schedule (loss of hand — 60%)
                    </span>
                    <span className={styles.calcVal}>× 60%</span>
                  </div>
                  <div className={`${styles.calcRow} ${styles.calcTotal}`}>
                    <span className={styles.calcKey}>Claim Paid</span>
                    <span className={`${styles.calcVal} ${styles.calcValTeal}`}>
                      ₹6,00,000
                    </span>
                  </div>
                </div>
                <p className={styles.storyNote}>
                  Rajan received ₹6 Lakh within 15 working days of claim settlement —
                  enough to cover medical expenses, home loan EMIs for 8 months, and
                  support his family while recovering.
                </p>
              </div>
              <div className={styles.storyPremiumNote}>
                <span>💰</span>
                <span>
                  Rajan paid just <strong>₹236/year</strong> (incl. GST) for ₹10L
                  cover — less than ₹20 per month.
                </span>
              </div>
            </div>
          </div>

          {/* WHY THIS PLAN */}
          <div className={styles.sectionCard}>
            <div className={styles.cardTitle}>
              <div className={`${styles.cardTitleIcon} ${styles.iconSaffron}`}>⭐</div>
              <div>
                <h2>Why Choose This Plan</h2>
                <p>Key advantages that make this product stand out</p>
              </div>
            </div>
            <div className={styles.coverageGrid}>
              {WHY_ITEMS.map((item) => (
                <div key={item.title} className={styles.covItem}>
                  <div className={`${styles.covCheck} ${styles.covCheckSaffron}`}>
                    <CheckSvg />
                  </div>
                  <div className={styles.covText}>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className={styles.sectionCard}>
            <div className={styles.cardTitle}>
              <div className={`${styles.cardTitleIcon} ${styles.iconSky}`}>❓</div>
              <div>
                <h2>Frequently Asked Questions</h2>
              </div>
            </div>
            <AccidentFaq />
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <AccidentPremiumCalculator />
        </aside>
      </div>
    </div>
  );
}
