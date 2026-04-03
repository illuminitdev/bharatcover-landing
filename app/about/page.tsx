import type { Metadata } from 'next';
import styles from './about.module.css';
import { FaBullseye, FaSearch, FaHeart, FaCheckCircle, FaStar } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'About Us - Corporate Insurance Care Platform',
  description: 'Learn about VS Insurance - Your trusted corporate insurance care platform delivering reliable and affordable insurance solutions to businesses.',
};

export default function About() {
  return (
    <div className={styles.about}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className="animate-fade-in-up">About VS Insurance</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Your trusted partner in corporate insurance care
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.content}>
            <div className={styles.contentBlock + ' animate-slide-in-left'}>
              <h2>Who We Are</h2>
              <p>
                We are a corporate insurance care platform focused on delivering reliable and
                affordable insurance solutions to businesses. Our approach combines industry
                expertise, insurer partnerships, and strong service execution to protect
                organizations and their people.
              </p>
            </div>

            <div className={styles.contentBlock + ' animate-slide-in-right'}>
              <h2>Our Vision</h2>
              <p>
                To become a trusted insurance partner for businesses by simplifying insurance
                and strengthening employee security.
              </p>
            </div>

            <div className={styles.contentBlock + ' animate-fade-in-up'}>
              <h2>Our Mission</h2>
              <ul className={styles.missionList}>
                <li>To provide transparent and affordable insurance solutions</li>
                <li>To ensure smooth onboarding and policy management</li>
                <li>To deliver dependable claims support</li>
                <li>To build long-term partnerships with clients</li>
              </ul>
            </div>

            <div className={styles.valuesSection}>
              <h2 className="section-title">Our Values</h2>
              <div className={styles.valuesGrid}>
                <div className={styles.valueCard}>
                  <span className={styles.valueIcon}><FaBullseye /></span>
                  <h3>Integrity</h3>
                  <p>Honest and ethical business practices in all our interactions</p>
                </div>
                <div className={styles.valueCard}>
                  <span className={styles.valueIcon}><FaSearch /></span>
                  <h3>Transparency</h3>
                  <p>Clear communication and open disclosure of all terms</p>
                </div>
                <div className={styles.valueCard}>
                  <span className={styles.valueIcon}><FaHeart /></span>
                  <h3>Customer-First</h3>
                  <p>Your needs and satisfaction are our top priority</p>
                </div>
                <div className={styles.valueCard}>
                  <span className={styles.valueIcon}><FaCheckCircle /></span>
                  <h3>Accountability</h3>
                  <p>Taking responsibility for our commitments and actions</p>
                </div>
                <div className={styles.valueCard}>
                  <span className={styles.valueIcon}><FaStar /></span>
                  <h3>Excellence</h3>
                  <p>Striving for the highest standards in service delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
