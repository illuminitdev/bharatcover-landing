import type { Metadata } from 'next';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About Us - Corporate Insurance Care Platform',
  description:
    'Learn about BharatCover - making insurance simple, honest, and affordable for individuals and businesses.',
};

export default function About() {
  return (
    <div className={styles.about}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <span className={styles.heroTag}>ABOUT BHARATCOVER</span>
            <h1>Making Insurance <span>Simple</span>, Honest &amp; Affordable.</h1>
            <p>
              We are an IRDAI-regulated insurance distribution platform on a mission to bring quality
              protection to every Indian family and business.
            </p>
            <div className={styles.heroCtas}>
              <a href="/personal/contact" className={styles.primaryBtn}>Talk to Us</a>
              <a href="/personal" className={styles.secondaryBtn}>See Our Plans</a>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroVisual}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1100&q=80"
                alt="BharatCover office and advisors"
              />
              <div className={styles.floatingCard}>
                <div className={styles.floatingLabel}>Status</div>
                <div className={styles.floatingTitle}>Launching Now</div>
                <div className={styles.floatingSub}>IRDAI Regulated · 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.breadcrumbBar}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>Home <span>›</span> About Us</div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span>WHY BHARATCOVER</span>
            <h2>Built on the Right Foundations</h2>
            <p>We may be new, but the infrastructure, partners and principles are solid from day one.</p>
          </div>
          <div className={styles.foundationsGrid}>
            <article className={styles.foundationCard}>
              <div className={styles.foundationIcon}>🏛️</div>
              <h3>IRDAI</h3>
              <p>Regulated</p>
              <p className={styles.foundationSub}>Fully licensed distribution platform</p>
            </article>
            <article className={styles.foundationCard}>
              <div className={styles.foundationIcon}>🤝</div>
              <h3>3+</h3>
              <p>Insurer Partners from day one</p>
            </article>
            <article className={styles.foundationCard}>
              <div className={styles.foundationIcon}>₹</div>
              <h3>₹85/yr</h3>
              <p>Plans starting from</p>
            </article>
            <article className={styles.foundationCard}>
              <div className={styles.foundationIcon}>🇮🇳</div>
              <h3>Pan India</h3>
              <p>Available across all states</p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altSection}`}>
        <div className={styles.container}>
          <div className={styles.storySplit}>
            <div className={styles.storyImageWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80"
                alt="Team discussing customer protection plans"
              />
            </div>
            <div className={styles.storyContent}>
              <span className={styles.storyTag}>OUR STORY</span>
              <h2>Born from a Real Need</h2>
              <p>
                BharatCover was founded by a team of insurance professionals who got tired of seeing
                people end up with the wrong cover — or no cover at all — because insurance felt too
                complicated, too expensive, or just too hard to understand.
              </p>
              <div className={styles.storyHighlight}>
                "If insurance is meant to protect people, why does it feel like it&apos;s designed to
                confuse them?"
              </div>
              <p>
                We&apos;re just getting started. By partnering directly with IRDAI-regulated insurers —
                Magma General, SBI General and Go Digit — we&apos;ve built a platform that cuts through
                the noise and puts straightforward, affordable cover in front of every Indian family
                and business.
              </p>
              <p>
                We don&apos;t have a long list of customers yet, but we have the right products, the
                right partners and the right intent.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span>WHAT WE STAND FOR</span>
            <h2>Our Core Values</h2>
            <p>Values that shape every plan recommendation and every customer interaction.</p>
          </div>
          <div className={styles.valuesGrid}>
            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>🔍</div>
              <h3>Full Transparency</h3>
              <p>Simple language, clear terms, and no hidden surprises.</p>
            </article>
            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>💰</div>
              <h3>Genuine Affordability</h3>
              <p>We believe good insurance should not cost a fortune.</p>
            </article>
            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>🛡️</div>
              <h3>Claims-First Culture</h3>
              <p>Support that stands by customers at the time they need it most.</p>
            </article>
            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>⚖️</div>
              <h3>Built for India</h3>
              <p>Products tailored to local realities, risks, and regulations.</p>
            </article>
            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>📋</div>
              <h3>Regulatory Integrity</h3>
              <p>Compliance-led operations aligned to IRDAI standards.</p>
            </article>
            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>⚡</div>
              <h3>Speed &amp; Simplicity</h3>
              <p>Quote in seconds. Buy in minutes. No unnecessary paperwork.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.altSection}`}>
        <div className={styles.container}>
          <div className={styles.storySplit}>
            <div className={styles.storyImageWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                alt="Small team building insurance solutions"
              />
            </div>
            <div className={styles.storyContent}>
              <span className={styles.storyTag}>OUR TEAM</span>
              <h2>Small Team, Big Ambition</h2>
              <p>
                BharatCover is built by a small, focused team of insurance professionals and
                technologists who believe that honest, simple insurance can become the norm in India.
              </p>
              <div className={styles.storyHighlight}>
                We&apos;re growing. If you&apos;re passionate about making insurance work for real people,
                we&apos;d love to hear from you.
              </div>
              <a href="/personal/contact" className={styles.primaryBtn}>Get in Touch →</a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span>OUR UNDERWRITING PARTNERS</span>
            <h2>Backed by India&apos;s Trusted Insurers</h2>
            <p>
              All BharatCover policies are underwritten by IRDAI-licensed general insurance companies.
            </p>
          </div>
          <div className={styles.partnerCards}>
            <article className={styles.partnerCard}>
              <div className={styles.partnerTitle}><span className={styles.dotRed} /> Magma General Insurance</div>
              <p>Personal Accident · Group PA</p>
            </article>
            <article className={styles.partnerCard}>
              <div className={styles.partnerTitle}><span className={styles.dotBlue} /> SBI General Insurance</div>
              <p>Health · Personal Accident</p>
            </article>
            <article className={styles.partnerCard}>
              <div className={styles.partnerTitle}><span className={styles.dotGreen} /> Go Digit General Insurance</div>
              <p>Group Health · Workmen Comp</p>
            </article>
          </div>
          <div className={styles.complianceBox}>
            <h3>IRDAI Regulated - Full Compliance</h3>
            <ul>
              <li>Registered insurance intermediary under IRDAI regulations</li>
              <li>All policies issued directly by the respective licensed insurer</li>
              <li>Policy wordings available from insurer websites at all times</li>
              <li>Grievance redressal via IRDAI Bima Bharosa / IGMS portal</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className={styles.container}>
          <h2>Ready to get protected?</h2>
          <p>Plans from ₹85/year. No paperwork. No jargon. Just honest cover.</p>
          <div className={styles.heroCtas}>
            <a href="/personal/contact" className={styles.primaryBtn}>Get a Free Quote →</a>
            <a href="/personal" className={styles.secondaryBtn}>View All Plans</a>
          </div>
        </div>
      </section>
    </div>
  );
}
