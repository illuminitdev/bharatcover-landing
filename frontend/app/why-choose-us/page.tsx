import type { Metadata } from 'next';
import styles from './why-choose-us.module.css';
import { FaTrophy, FaDollarSign, FaPhoneAlt, FaChartBar, FaBolt, FaSync, FaRocket, FaUserFriends, FaCheckCircle, FaBullseye, FaLock, FaChartLine } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Why Choose Us - Your Trusted Corporate Insurance Partner',
  description: 'Discover why businesses trust VS Insurance for corporate insurance solutions. Multiple insurers, competitive pricing, dedicated support, and fast claims assistance.',
};

export default function WhyChooseUs() {
  return (
    <div className={styles.whyPage}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className="animate-fade-in-up">Why Choose VS Insurance</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Your Trusted Corporate Insurance Partner
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.intro}>
            <h2 className="section-title">We Go Beyond Selling Policies</h2>
            <p className="section-subtitle">
              We support businesses throughout the insurance lifecycle, ensuring peace of mind at every step.
            </p>
          </div>

          <div className={styles.reasonsGrid}>
            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaTrophy /></span>
              <h3>Multiple Insurance Providers</h3>
              <p>
                Access to multiple insurance companies under one platform, giving you the best
                options and competitive pricing for your needs.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaDollarSign /></span>
              <h3>Competitive & Transparent Pricing</h3>
              <p>
                No hidden costs. We provide clear policy terms with the best rates in the market,
                ensuring value for your investment.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaPhoneAlt /></span>
              <h3>Single Point of Contact</h3>
              <p>
                Dedicated corporate relationship managers who understand your business and provide
                personalized attention.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaChartBar /></span>
              <h3>Policy Comparison & Advisory</h3>
              <p>
                Expert guidance to help you choose the right coverage based on your industry,
                workforce, and risk profile.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaBolt /></span>
              <h3>Fast Claims Assistance</h3>
              <p>
                End-to-end claims handholding with dedicated support, regular updates, and faster
                resolution timelines.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaSync /></span>
              <h3>Seamless Renewals</h3>
              <p>
                Timely renewal reminders and smooth policy continuation without any hassle or
                lapses in coverage.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaRocket /></span>
              <h3>Quick Onboarding</h3>
              <p>
                Faster policy issuance and employee onboarding process, minimizing paperwork and
                delays.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaUserFriends /></span>
              <h3>Employee Support Desk</h3>
              <p>
                Direct support channels for your employees to resolve queries and get assistance
                when they need it.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaCheckCircle /></span>
              <h3>Compliant & Professional</h3>
              <p>
                Fully compliant operations with professional service delivery, adhering to all
                regulatory requirements.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaBullseye /></span>
              <h3>Industry Expertise</h3>
              <p>
                Deep understanding of various industries and their unique insurance requirements,
                from manufacturing to IT.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaLock /></span>
              <h3>Data Security</h3>
              <p>
                Your sensitive business and employee data is protected with industry-standard
                security measures.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span className={styles.reasonIcon}><FaChartLine /></span>
              <h3>Scalable Solutions</h3>
              <p>
                Insurance plans that grow with your business, easily accommodating new employees
                and changing needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
