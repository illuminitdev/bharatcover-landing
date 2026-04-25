'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const pathname = usePathname();
  const isCheckoutFlow = pathname.startsWith('/sales/products') || 
                         pathname.startsWith('/sales/contact') || 
                         pathname.startsWith('/sales/checkout');

  if (isCheckoutFlow) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <h3 className={styles.footerLogo}>Bharat Cover</h3>
            <p className={styles.footerDesc}>
              Your trusted corporate insurance care platform, delivering reliable and affordable
              insurance solutions to protect organizations and their people.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerTitle}>Products</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/products#personal-accident">Personal Accident Insurance</Link></li>
              <li><Link href="/products#group-health">Group Health Insurance</Link></li>
              <li><Link href="/products#group-term-life">Group Term Life Insurance</Link></li>
              <li><Link href="/products#workmen-compensation">Workmen Compensation</Link></li>
              <li><Link href="/products#opd-wellness">OPD & Wellness Plans</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerTitle}>Company</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/why-choose-us">Why Choose Us</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerTitle}>Support</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/claims">Claims Assistance</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerTitle}>Contact</h4>
            <ul className={styles.contactInfo}>
              <li><FaPhoneAlt style={{ display: 'inline', marginRight: '8px' }} /> +91 7680064255</li>
              <li><FaEnvelope style={{ display: 'inline', marginRight: '8px' }} /> info@bharatcover.net</li>
              <li><FaMapMarkerAlt style={{ display: 'inline', marginRight: '8px' }} /> 1st Floor, Phase II, Ratnam chambers, H.No. 1-62/172, Plot No.172, Kavuri Hills, Madhapur, Hyderabad, Telangana 500033</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Bharat Cover. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
