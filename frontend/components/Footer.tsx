'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.column}>
            <h3 className={styles.title}>BHARATCOVER</h3>
            <p className={styles.description}>
              IRDAI-regulated insurance distribution platform. Policies underwritten by Magma
              General, SBI General and Go Digit General Insurance.
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>PERSONAL PLANS</h4>
            <ul className={styles.links}>
              <li><Link href="/personal/health-insurance">Bharat Arogya Individual</Link></li>
              <li><Link href="/personal">Bharat Arogya Family Floater</Link></li>
              <li><Link href="/personal/accident">Bharat Suraksha Accident</Link></li>
              <li><Link href="/personal/health-quote">Bharat Suraksha Daily Cash</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>BUSINESS PLANS</h4>
            <ul className={styles.links}>
              <li><Link href="/business">Group Health Insurance</Link></li>
              <li><Link href="/personal/accident">Group Personal Accident</Link></li>
              <li><Link href="/personal/health-insurance">School &amp; College PA</Link></li>
              <li><Link href="/business">Workmen Compensation</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>SUPPORT</h4>
            <ul className={styles.links}>
              <li><Link href="/personal/health-quote">Get a Quote</Link></li>
              <li><Link href="/claims">Claims Support</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>FOLLOW US</h4>
            <ul className={`${styles.links} ${styles.socialLinks}`}>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://www.facebook.com/profile.php?id=61563633155912"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF className={styles.socialIcon} /> Facebook
                </a>
              </li>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://www.instagram.com/bharatcover_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className={styles.socialIcon} /> Instagram
                </a>
              </li>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://www.linkedin.com/company/bharatcover/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedinIn className={styles.socialIcon} /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://www.youtube.com/@bharatcover_official"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className={styles.socialIcon} /> YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; 2024 BharatCover Insurance Brokers Pvt. Ltd. IRDAI Registration No. XXXXXXX.
            All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/privacy">Cookie Policy</Link>
            <Link href="/terms">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
