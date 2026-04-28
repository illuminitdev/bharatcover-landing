import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>India&apos;s #1 affordable insurance platform</div>
            <h1 className={styles.heroTitle}>
              India&apos;s Most <span>Affordable</span> Insurance.
              <br />
              For Everyone.
            </h1>
            <p className={styles.heroDescription}>
              Plans from Rs 85/year. Trusted by individuals, families and businesses across India.
            </p>
            <div className={styles.heroCards}>
              <Link href="/personal" className={styles.heroCard}>
                <span className={styles.heroCardIcon}>🛡️</span>
                <div className={styles.heroCardTitle}>Personal Cover</div>
                <div className={styles.heroCardSub}>Health · Accident · Daily Cash</div>
                <span className={styles.heroCardCta}>Explore Personal Plans →</span>
              </Link>
              <Link href="/business" className={styles.heroCard}>
                <span className={styles.heroCardIcon}>🏢</span>
                <div className={styles.heroCardTitle}>Business Cover</div>
                <div className={styles.heroCardSub}>Group Health · PA · Workmen Comp</div>
                <span className={styles.heroCardCta}>Explore Business Plans →</span>
              </Link>
            </div>
            <div className={styles.heroTrust}>
              Backed by Magma General · SBI General · Go Digit · IRDAI Regulated
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroVisual}>
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
                alt="Happy families protected by BharatCover"
              />
              <div className={styles.priceCard}>
                <div className={styles.priceLabel}>Plans Starting</div>
                <div className={styles.priceValue}>Rs 85</div>
                <div className={styles.priceSub}>For individuals & families</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.partnerBar}>
        <div className={styles.partnerInner}>
          <span className={styles.partnerLabel}>Our Insurance Partners</span>
          <div className={styles.partnerPill}>Magma General Insurance</div>
          <div className={styles.partnerPill}>SBI General Insurance</div>
          <div className={styles.partnerPill}>Go Digit General Insurance</div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2>Personal Insurance Plans</h2>
            <Link href="/personal">View all personal plans →</Link>
          </div>
          <div className={styles.twoCol}>
            <Link href="/personal/accident" className={styles.productCard}>
              <div className={styles.productBadgeRow}>
                <span className={styles.productBadge}>SBI General</span>
                <span className={styles.productBadge}>Go Digit</span>
              </div>
              <p className={styles.productType}>Personal Accident</p>
              <h3>Accident & Disability Cover</h3>
              <p>
                Protect yourself and your income against accidental death and disability. Cover
                starts from day one.
              </p>
              <ul className={styles.pointList}>
                <li>Accidental Death — 100% sum insured</li>
                <li>Permanent Total & Partial Disability</li>
                <li>No waiting period. Cover from Day 1</li>
                <li>Ages 18-65 · cover Rs 1L-15L</li>
              </ul>
              <div className={styles.productBottom}>
                <div>
                  <span className={styles.fromLabel}>From</span>
                  <strong className={styles.fromPrice}>Rs 299</strong>
                  <span className={styles.fromTenure}>/year</span>
                </div>
                <span className={styles.viewBtn}>View Plans →</span>
              </div>
            </Link>
            <Link href="/personal/health-insurance" className={styles.productCard}>
              <div className={styles.productBadgeRow}>
                <span className={styles.productBadge}>Magma General Insurance</span>
              </div>
              <p className={styles.productType}>Health Insurance</p>
              <h3>Health & Hospitalisation Cover</h3>
              <p>
                Health indemnity plans for individuals and families with in-patient and day care
                benefits.
              </p>
              <ul className={styles.pointList}>
                <li>In-Patient Hospitalisation — up to SI</li>
                <li>Pre & Post-Hospitalisation included</li>
                <li>Individual & Family Floater plans</li>
                <li>Ages 18-65 · cover Rs 1L-5L</li>
              </ul>
              <div className={styles.productBottom}>
                <div>
                  <span className={styles.fromLabel}>From</span>
                  <strong className={styles.fromPrice}>Rs 750</strong>
                  <span className={styles.fromTenure}>/year</span>
                </div>
                <span className={styles.viewBtnAlt}>View Plans →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2>Business & Institutional Plans</h2>
            <Link href="/business">View all business plans →</Link>
          </div>
          <div className={styles.grid3}>
            <Link href="/business" className={styles.bizCard}>
              <span className={styles.bizChip}>Custom Quotes</span>
              <h3>Group Health Insurance</h3>
              <p>Bulk employee health plans tailored to your organization&apos;s size and needs.</p>
              <span className={styles.bizLink}>Get Quote →</span>
            </Link>
            <Link href="/business" className={styles.bizCard}>
              <span className={styles.bizChip}>Per Employee Pricing</span>
              <h3>Group Personal Accident</h3>
              <p>Accident cover for your entire staff with flexible per-employee pricing.</p>
              <span className={styles.bizLink}>Get Quote →</span>
            </Link>
            <Link href="/business" className={styles.bizCard}>
              <span className={styles.bizChip}>IRDAI Compliant</span>
              <h3>Workmen Compensation</h3>
              <p>Statutory compliance cover for workmen compensation mandated by law.</p>
              <span className={styles.bizLink}>Get Quote →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section} id="about">
        <div className={styles.sectionInner}>
          <div className={styles.centerHead}>
            <h2>Why Thousands Choose Bharat Cover</h2>
            <div className={styles.headAccent} />
          </div>
          <div className={styles.grid4}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>💰</div>
              <h3>Plans from Rs85/year</h3>
              <p>No-frills, affordable cover that fits every budget — from daily workers to executives.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🏆</div>
              <h3>Trusted Insurers</h3>
              <p>Backed by Magma General, SBI General & Go Digit — names India trusts for decades.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>⚡</div>
              <h3>Zero Waiting on PA</h3>
              <p>Bharat Suraksha Accident covers from Day 1 — no waiting period, no surprises.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🇮🇳</div>
              <h3>Built for Bharat</h3>
              <p>Products designed for Indian families and businesses, at prices that make sense here.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="claims">
        <div className={styles.sectionInner}>
          <div className={styles.centerHead}>
            <h2>Get Covered in 3 Simple Steps</h2>
            <div className={styles.headAccent} />
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Choose Your Plan</h3>
              <p>Browse personal or business plans tailored to your exact needs and budget.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Get Your Quote</h3>
              <p>Instant pricing with no hidden fees. What you see is exactly what you pay.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Stay Protected</h3>
              <p>Policy issued immediately. Coverage starts right away — no delays, no paperwork.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statsStrip}>
        <div className={styles.sectionInner}>
          <div className={styles.grid4}>
            <div className={styles.statItem}><strong>Rs 85</strong><span>Lowest Annual Premium</span></div>
            <div className={styles.statItem}><strong>4</strong><span>Products Across Personal & Business</span></div>
            <div className={styles.statItem}><strong>18-65</strong><span>Age Coverage Range</span></div>
            <div className={styles.statItem}><strong>3</strong><span>Trusted Insurer Partners</span></div>
          </div>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className={styles.sectionInner}>
          <h2>Ready to Get Covered?</h2>
          <p>Join thousands of Indians protected by Bharat Cover</p>
          <div className={styles.bottomCtas}>
            <Link href="/personal" className={styles.ctaPrimary}>
              Get Personal Quote
            </Link>
            <Link href="/business" className={styles.ctaSecondaryDark}>
              Get Business Quote
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
