import CTAButton from '@/components/CTAButton';
import styles from './page.module.css';
import Image from 'next/image';
import { HiOfficeBuilding, HiUserGroup } from 'react-icons/hi';
import { FaHandshake, FaGlobeAmericas, FaShieldAlt, FaBriefcase, FaTrophy, FaDollarSign, FaBullseye, FaBolt, FaRocket, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { MdLocalHospital, MdHealthAndSafety } from 'react-icons/md';
import { GiGearStickPattern } from 'react-icons/gi';
import { BiSpa } from 'react-icons/bi';
import { LampEffect } from '@/components/ui/LampEffect';
import { GridBackground } from '@/components/ui/GridBackground';
import { GlowCard } from '@/components/ui/GlowCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { TextGenerateEffect } from '@/components/ui/TextGenerateEffect';
import { MovingBorderButton } from '@/components/ui/MovingBorderButton';

export default function Home() {
  return (
    <div className={styles.home}>
      {/* Full-Screen Hero Section */}
      <LampEffect>
        <GridBackground>
          <div className={styles.heroContainer}>
            <div className="container">
              <div className={styles.heroContent}>
                <div className={styles.heroText}>
                  <h1 className={styles.heroTitle}>
                    Smart Insurance Care for Your <span className={styles.gradient}>Workforce</span>
                  </h1>
                  <p className={styles.heroDescription}>
                    Comprehensive Personal Accident and Employee Insurance Solutions designed for
                    growing businesses, MSMEs, and large enterprises.
                  </p>
                  <div className={styles.heroButtons}>
                    <MovingBorderButton href="/sales" variant="primary" size="large">
                      Sales
                    </MovingBorderButton>
                    <MovingBorderButton href="/contact" variant="primary" size="large">
                      Get a Quote
                    </MovingBorderButton>
                    <MovingBorderButton href="/contact" variant="secondary" size="large">
                      Talk to an Expert
                    </MovingBorderButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GridBackground>
      </LampEffect>

      {/* Trust Bar */}
      <section className={styles.trustBar}>
        <div className="container">
          <div className={styles.trustItems}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}><HiOfficeBuilding /></span>
              <p><strong><AnimatedCounter value={100} suffix="+" /></strong> Companies</p>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}><HiUserGroup /></span>
              <p><strong><AnimatedCounter value={10000} suffix="+" /></strong> Employees</p>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}><FaHandshake /></span>
              <p><strong><AnimatedCounter value={61} suffix="+" /></strong> Insurance Partners</p>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}><FaGlobeAmericas /></span>
              <p><strong>Pan-India</strong> Reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Snapshot */}
      <section className="section">
        <div className="container">
          <div className={styles.aboutSnapshot}>
            <h2 className="section-title">Insurance Solutions Built for Businesses</h2>
            <p className="section-subtitle">
              We help organizations safeguard their employees with reliable, cost-effective insurance
              coverage. From Personal Accident policies to complete employee benefit programs, we
              deliver protection with simplicity and trust.
            </p>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className={`section ${styles.productsSection}`}>
        <div className="container">
          <h2 className="section-title">Our Insurance Products</h2>
          <p className="section-subtitle">
            Comprehensive coverage solutions tailored for your business needs
          </p>
          <div className={styles.productsGrid}>
            <GlowCard>
              <span className={styles.productIcon}><FaShieldAlt /></span>
              <h3>Personal Accident Insurance</h3>
              <p>
                Round-the-clock protection against accidental death, disability, and medical
                expenses for employees across industries.
              </p>
              <CTAButton href="/contact" variant="primary" size="small">
                Get Quote
              </CTAButton>
            </GlowCard>

            <GlowCard>
              <span className={styles.productIcon}><MdLocalHospital /></span>
              <h3>Group Health Insurance</h3>
              <p>
                Comprehensive medical coverage for employees and their families with flexible
                sum insured options.
              </p>
              <CTAButton href="/contact" variant="primary" size="small">
                Get Quote
              </CTAButton>
            </GlowCard>

            <GlowCard>
              <span className={styles.productIcon}><FaBriefcase /></span>
              <h3>Group Term Life Insurance</h3>
              <p>
                Financial security for employees&apos; families in the event of an unfortunate loss.
              </p>
              <CTAButton href="/contact" variant="primary" size="small">
                Get Quote
              </CTAButton>
            </GlowCard>

            <GlowCard>
              <span className={styles.productIcon}><GiGearStickPattern /></span>
              <h3>Workmen Compensation Insurance</h3>
              <p>
                Statutory coverage protecting employers against workplace injury liabilities.
              </p>
              <CTAButton href="/contact" variant="primary" size="small">
                Get Quote
              </CTAButton>
            </GlowCard>

            <GlowCard>
              <span className={styles.productIcon}><MdHealthAndSafety /></span>
              <h3>OPD and Wellness Plans</h3>
              <p>
                Preventive healthcare and outpatient benefits designed to reduce absenteeism and
                improve productivity.
              </p>
              <CTAButton href="/contact" variant="primary" size="small">
                Get Quote
              </CTAButton>
            </GlowCard>

            <GlowCard>
              <span className={styles.productIcon}><BiSpa /></span>
              <h3>Customized Corporate Solutions</h3>
              <p>
                Tailor-made insurance plans based on industry, workforce size, and risk profile.
              </p>
              <CTAButton href="/contact" variant="primary" size="small">
                Get Quote
              </CTAButton>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`section ${styles.whySection}`}>
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            Your trusted partner in corporate insurance care
          </p>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><FaTrophy /></span>
              <h3>Multiple Insurers</h3>
              <p>Access to multiple insurance providers under one platform</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><FaDollarSign /></span>
              <h3>Competitive Pricing</h3>
              <p>Transparent policy terms with the best rates in the market</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><FaBullseye /></span>
              <h3>Dedicated Support</h3>
              <p>Corporate relationship managers for personalized service</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><FaBolt /></span>
              <h3>Fast Claims</h3>
              <p>End-to-end claims assistance with faster resolution</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><FaRocket /></span>
              <h3>Quick Onboarding</h3>
              <p>Faster onboarding and policy issuance process</p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><FaCheckCircle /></span>
              <h3>Compliant Operations</h3>
              <p>Professional and fully compliant service delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Claims Assistance Highlight */}
      <section className={`section ${styles.claimsSection}`}>
        <div className="container">
          <h2 className="section-title">Hassle-Free Claims Assistance</h2>
          <p className="section-subtitle">
            We provide end-to-end claims assistance to ensure peace of mind
          </p>
          <div className={styles.claimsProcess}>
            <div className={styles.claimsStep}>
              <span className={styles.stepNumber}>1</span>
              <h3>Claims Intimation</h3>
              <p>Report your claim through multiple channels</p>
            </div>
            <div className={styles.claimsStep}>
              <span className={styles.stepNumber}>2</span>
              <h3>Documentation</h3>
              <p>Document collection and verification support</p>
            </div>
            <div className={styles.claimsStep}>
              <span className={styles.stepNumber}>3</span>
              <h3>Insurer Coordination</h3>
              <p>Direct liaison with insurance company</p>
            </div>
            <div className={styles.claimsStep}>
              <span className={styles.stepNumber}>4</span>
              <h3>Settlement Support</h3>
              <p>Regular updates until claim settlement</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <CTAButton href="/claims" variant="primary">
              Know More
            </CTAButton>
          </div>
        </div>
      </section>

    </div>
  );
}
