import type { Metadata } from 'next';
import CTAButton from '@/components/CTAButton';
import styles from './claims.module.css';
import { FaUserTie, FaChartBar, FaBolt, FaMobileAlt, FaFileAlt, FaHandshake } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Claims Assistance - Hassle-Free Claims Support',
  description: 'End-to-end claims assistance with dedicated claims manager, regular updates, and faster resolution. Learn about our claims process.',
};

export default function Claims() {
  return (
    <div className={styles.claimsPage}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className="animate-fade-in-up">Hassle-Free Claims Assistance</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            We provide end-to-end claims assistance to ensure peace of mind
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.intro}>
            <h2 className="section-title">Your Claims, Our Priority</h2>
            <p className="section-subtitle">
              From intimation to settlement, we stand by your side throughout the claims journey
            </p>
          </div>

          <div className={styles.processSection}>
            <h3 className={styles.processTitle}>Our Claims Process</h3>
            <div className={styles.processSteps}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>Claims Intimation</h4>
                  <p>
                    Report your claim through multiple channels - phone, email, or online portal.
                    Our team acknowledges receipt within 24 hours.
                  </p>
                  <ul>
                    <li>Phone support available 24/7</li>
                    <li>Email: claims@bharatcover.net</li>
                    <li>Online claims portal</li>
                    <li>WhatsApp support</li>
                  </ul>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>Document Collection & Verification</h4>
                  <p>
                    Our claims team guides you through the required documentation and helps with
                    verification.
                  </p>
                  <ul>
                    <li>Document checklist provided</li>
                    <li>Assistance in collecting required papers</li>
                    <li>Pre-verification before submission</li>
                    <li>Digital document upload facility</li>
                  </ul>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>Insurer Coordination</h4>
                  <p>
                    We liaise directly with the insurance company on your behalf, ensuring smooth
                    processing.
                  </p>
                  <ul>
                    <li>Direct communication with insurers</li>
                    <li>Status tracking and updates</li>
                    <li>Query resolution support</li>
                    <li>Escalation management if needed</li>
                  </ul>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h4>Settlement Follow-up</h4>
                  <p>
                    Regular updates until claim settlement with dedicated support throughout the
                    process.
                  </p>
                  <ul>
                    <li>Weekly status updates</li>
                    <li>Faster turnaround time</li>
                    <li>Settlement verification</li>
                    <li>Post-settlement support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.supportSection}>
            <h3 className="section-title">Our Claims Support</h3>
            <div className={styles.supportGrid}>
              <div className={styles.supportCard}>
                <span className={styles.supportIcon}><FaUserTie /></span>
                <h4>Dedicated Claims Manager</h4>
                <p>
                  Your single point of contact for all claims-related queries and updates
                </p>
              </div>

              <div className={styles.supportCard}>
                <span className={styles.supportIcon}><FaChartBar /></span>
                <h4>Regular Status Updates</h4>
                <p>
                  Proactive communication keeping you informed at every stage of the claim
                </p>
              </div>

              <div className={styles.supportCard}>
                <span className={styles.supportIcon}><FaBolt /></span>
                <h4>Faster Resolution</h4>
                <p>
                  Streamlined processes and strong insurer relationships for quicker settlements
                </p>
              </div>

              <div className={styles.supportCard}>
                <span className={styles.supportIcon}><FaMobileAlt /></span>
                <h4>Multi-Channel Support</h4>
                <p>
                  Reach us through phone, email, WhatsApp, or online portal at your convenience
                </p>
              </div>

              <div className={styles.supportCard}>
                <span className={styles.supportIcon}><FaFileAlt /></span>
                <h4>Documentation Assistance</h4>
                <p>
                  Complete guidance on required documents with verification support
                </p>
              </div>

              <div className={styles.supportCard}>
                <span className={styles.supportIcon}><FaHandshake /></span>
                <h4>End-to-End Support</h4>
                <p>
                  From intimation to settlement, we are with you every step of the way
                </p>
              </div>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <h3>Need Claims Assistance?</h3>
            <p>Our dedicated team is ready to help you with your claims</p>
            <div className={styles.ctaButtons}>
              <CTAButton href="/contact" variant="primary" size="large">
                Contact Claims Team
              </CTAButton>
              <CTAButton href="tel:+917680064255" variant="outline" size="large">
                Call: +91 7680064255
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
