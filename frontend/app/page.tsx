import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}></div>
            <h1 className={styles.heroTitle}>
              One Membership.
Wellness + Insurance.
For Every Indian.
            </h1>
            <p className={styles.heroDescription}>
             From ₹85/year — teleconsultations, diagnostic discounts and insurance cover, all bundled into one simple membership.
            </p>
            <div className={styles.heroCards}>
              <Link href="/personal" className={styles.heroCard}>
                <span className={styles.heroCardIcon}>
                  <img src="/icons/personal.svg" alt="Personal cover icon" width="48" height="48" />
                </span>
                <div className={styles.heroCardTitle}>Bharat Arogya</div>
                <div className={styles.heroCardSub}>Health Insurance + Wellness membership</div>
                <span className={styles.heroCardCta}>Explore Membership →</span>
              </Link>
              <Link href="/business" className={styles.heroCard}>
                <span className={styles.heroCardIcon}>
                  <img src="/icons/business.svg" alt="Business cover icon" width="48" height="48" />
                </span>
                <div className={styles.heroCardTitle}>Bharat Suraksha</div>
                <div className={styles.heroCardSub}>Accident Cover + Wellness Membership</div>
                <span className={styles.heroCardCta}>Explore Membership →</span>
              </Link>
            </div>
            <div className={styles.heroTrust}>
              From ₹85/year — teleconsultations, diagnostic discounts and insurance cover, all bundled into one simple membership.
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
          <div className={styles.partnerHeader}>
            <h3 className={styles.partnerTitle}>Our Insurance Partners</h3>
            <p className={styles.partnerSubtitle}>Trusted by millions across India</p>
          </div>
          <div className={styles.partnerLogos}>
            <div className={styles.partnerLogo}>
              <div className={styles.partnerLogoContent}>
                <img src="/images/magna.png" alt="Magma General" className={styles.partnerLogoImage} />
              </div>
            </div>
            <div className={styles.partnerLogo}>
              <div className={styles.partnerLogoContent}>
                <img src="/logos/partners/sbi.png" alt="SBI General" className={styles.partnerLogoImage} />
              </div>
            </div>
            <div className={styles.partnerLogo}>
              <div className={styles.partnerLogoContent}>
                <img
                  src="/logos/partners/digit.png"
                  alt="Go Digit General Insurance"
                  className={styles.partnerLogoImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BharatCover Memberships Section */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <h2>BharatCover Memberships</h2>
              <p className={styles.membershipSubtitle}>Insurance cover + everyday wellness benefits — in one membership</p>
            </div>
            <Link href="/personal">View all memberships →</Link>
          </div>

          {/* Wellness bar */}
          <div className={styles.wellnessBar}>
            <span className={styles.wellnessBarLabel}>💚 Every membership includes:</span>
            <span className={styles.wellnessBarItem}>📞 Unlimited Teleconsultations</span>
            <span className={styles.wellnessBarItem}>🔬 Up to 80% off Diagnostics</span>
            <span className={styles.wellnessBarItem}>🩻 Up to 30% off Radiology</span>
            <span className={styles.wellnessBarItem}>👨‍⚕️ Up to 30% off Specialist Visits</span>
            <span className={styles.wellnessBarNetwork}>via zAppy Network</span>
          </div>

          <div className={styles.twoCol}>
            {/* Card 1 - Bharat Suraksha */}
            <Link href="/personal/accident" className={styles.membershipCard}>
              <div className={styles.membershipCardTop}>
                <div className={styles.membershipIconWrap}>
                  <img src="/icons/personal.svg" alt="Accident cover" width="28" height="28" />
                </div>
                <span className={styles.membershipBadge}>SBI General · Wellness via zAppy</span>
              </div>
              <p className={styles.membershipType}>BHARAT SURAKSHA · MEMBERSHIP</p>
              <h3 className={styles.membershipTitle}>Accident Cover + Wellness</h3>
              <p className={styles.membershipDesc}>
                Personal accident insurance bundled with unlimited teleconsultations and healthcare discounts for your whole family.
              </p>
              <ul className={styles.membershipList}>
                <li>Accidental Death &amp; Disability — from ₹1L–₹15L</li>
                <li>Unlimited Teleconsultations (GP + Specialists)</li>
                <li>Up to 80% off Diagnostic Tests</li>
                <li>Up to 30% off Radiology &amp; Specialist Visits</li>
              </ul>
              <div className={styles.membershipBottom}>
                <div>
                  <span className={styles.fromLabel}>From </span>
                  <strong className={styles.membershipPrice}>₹299</strong>
                  <span className={styles.fromTenure}> /year</span>
                </div>
                <span className={styles.membershipCta}>View Membership →</span>
              </div>
            </Link>

            {/* Card 2 - Bharat Arogya */}
            <Link href="/personal/health-insurance" className={styles.membershipCard}>
              <div className={styles.membershipCardTop}>
                <div className={styles.membershipIconWrapBlue}>
                  <img src="/icons/personal.svg" alt="Health insurance" width="28" height="28" />
                </div>
                <span className={styles.membershipBadge}>SBI General · Wellness via zAppy</span>
              </div>
              <p className={styles.membershipType}>BHARAT AROGYA · MEMBERSHIP</p>
              <h3 className={styles.membershipTitle}>Health Insurance + Wellness</h3>
              <p className={styles.membershipDesc}>
                Comprehensive health indemnity plus everyday wellness — teleconsultations, diagnostics and specialist discounts, all in one membership.
              </p>
              <ul className={styles.membershipList}>
                <li>In-Patient Hospitalisation &amp; Day Care</li>
                <li>Unlimited Teleconsultations for Family</li>
                <li>Up to 80% off Diagnostic Tests</li>
                <li>Individual &amp; Family Floater Plans</li>
              </ul>
              <div className={styles.membershipBottom}>
                <div>
                  <span className={styles.fromLabel}>From </span>
                  <strong className={styles.membershipPrice}>₹750</strong>
                  <span className={styles.fromTenure}> /year</span>
                </div>
                <span className={styles.membershipCtaBlue}>View Membership →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Business & Institutional Plans Section */}
      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <h2>Business &amp; Institutional Plans</h2>
              <p className={styles.bizSectionSubtitle}>Protecting your workforce, students and operations</p>
            </div>
            <Link href="/business">View all business plans →</Link>
          </div>
          <div className={styles.grid4}>
            <Link href="/business" className={styles.bizCard}>
              <div className={styles.bizIcon}>🏢</div>
              <h3>Group Health Insurance</h3>
              <p className={styles.bizType}>Corporate Health Cover</p>
              <span className={styles.bizChip}>Custom Quotes</span>
              <p>Bulk employee health plans tailored to your organization&apos;s size and needs.</p>
              <span className={styles.bizLink}>Get Quote →</span>
            </Link>
            <Link href="/business" className={styles.bizCard}>
              <div className={styles.bizIcon}>👷</div>
              <h3>Group Personal Accident</h3>
              <p className={styles.bizType}>Workforce Protection</p>
              <span className={styles.bizChip}>Per Employee Pricing</span>
              <p>Accident cover for your entire staff with flexible per-employee pricing.</p>
              <span className={styles.bizLink}>Get Quote →</span>
            </Link>
            <Link href="/business/school-pa" className={styles.bizCard}>
              <div className={styles.bizIcon}>🎓</div>
              <h3>School &amp; College PA</h3>
              <p className={styles.bizType}>Institutional Accident</p>
              <span className={styles.bizChip}>Special Institutional Rates</span>
              <p>Student and staff accident cover with special institutional rates for schools and colleges.</p>
              <span className={styles.bizLink}>Get Quote →</span>
            </Link>
            <Link href="/business" className={styles.bizCard}>
              <div className={styles.bizIcon}>⚙️</div>
              <h3>Workmen Compensation</h3>
              <p className={styles.bizType}>WC Insurance</p>
              <span className={styles.bizChip}>IRDAI Compliant</span>
              <p>Statutory compliance cover for workmen compensation mandated by law.</p>
              <span className={styles.bizLink}>Get Quote →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className={styles.section} id="about">
        <div className={styles.sectionInner}>
          <div className={styles.centerHead}>
            <h2>Why Thousands Choose<br /> Bharat Cover</h2>
            <div className={styles.headAccent} />
          </div>
          <div className={styles.grid4}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <img src="/icons/hi.svg" width="48" height="48" alt="Affordable plans icon" />
              </div>
              <h3>Plans from Rs85/year</h3>
              <p>No-frills, affordable cover that fits every budget — from daily workers to executives.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <img src="/icons/trust.svg" width="48" height="48" alt="Trusted insurers icon" />
              </div>
              <h3>Trusted Insurers</h3>
              <p>Backed by Magma General, SBI General &amp; Go Digit — names India trusts for decades.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <img src="/icons/nowaitingperiod.svg" width="48" height="48" alt="No waiting period icon" />
              </div>
              <h3>Zero Waiting on PA</h3>
              <p>Bharat Suraksha Accident covers from Day 1 — no waiting period, no surprises.</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <img src="/icons/buildforbharat.svg" width="48" height="48" alt="Built for Bharat icon" />
              </div>
              <h3>Built for Bharat</h3>
              <p>Products designed for Indian families and businesses, at prices that make sense here.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
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

      {/* Stats Strip */}
      <section className={styles.statsStrip}>
        <div className={styles.sectionInner}>
          <div className={styles.grid4}>
            <div className={styles.statItem}>
              <strong>Rs 85</strong>
              <span>Lowest Annual Premium</span>
            </div>
            <div className={styles.statItem}>
              <strong>4</strong>
              <span>Products Across Personal &amp; Business</span>
            </div>
            <div className={styles.statItem}>
              <strong>18-65</strong>
              <span>Age Coverage Range</span>
            </div>
            <div className={styles.statItem}>
              <strong>3</strong>
              <span>Trusted Insurer Partners</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
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