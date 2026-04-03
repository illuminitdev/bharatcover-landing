import type { Metadata } from 'next';
import CTAButton from '@/components/CTAButton';
import styles from './products.module.css';
import { FaShieldAlt, FaBriefcase } from 'react-icons/fa';
import { MdLocalHospital, MdHealthAndSafety } from 'react-icons/md';
import { GiGearStickPattern } from 'react-icons/gi';
import { BiSpa } from 'react-icons/bi';

export const metadata: Metadata = {
  title: 'Our Products - Corporate Insurance Solutions',
  description: 'Explore our comprehensive range of corporate insurance products including Personal Accident, Group Health, Group Term Life, Workmen Compensation, and OPD Wellness Plans.',
};

export default function Products() {
  return (
    <div className={styles.products}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className="animate-fade-in-up">Our Insurance Products</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Comprehensive coverage solutions tailored for your business needs
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.productsList}>
            {/* Personal Accident Insurance */}
            <div className={styles.productItem} id="personal-accident">
              <div className={styles.productContent}>
                <span className={styles.productIcon}><FaShieldAlt /></span>
                <h2>Personal Accident Insurance</h2>
                <p className={styles.productDesc}>
                  Personal Accident Insurance provides financial protection against accidental
                  injuries, disabilities, or death.
                </p>

                <div className={styles.productFeatures}>
                  <h3>Key Features</h3>
                  <ul>
                    <li>24x7 worldwide coverage</li>
                    <li>Accidental death benefit</li>
                    <li>Permanent and temporary disability cover</li>
                    <li>Medical expenses reimbursement</li>
                    <li>Optional add-ons based on requirement</li>
                  </ul>
                </div>

                <div className={styles.productIdealFor}>
                  <h3>Ideal For</h3>
                  <p>
                    Manufacturing units, IT companies, logistics firms, MSMEs, construction
                    companies, and service organizations.
                  </p>
                </div>

                <CTAButton href="/contact" variant="primary">
                  Get Quote
                </CTAButton>
              </div>
            </div>

            {/* Group Health Insurance */}
            <div className={styles.productItem} id="group-health">
              <div className={styles.productContent}>
                <span className={styles.productIcon}><MdLocalHospital /></span>
                <h2>Group Health Insurance</h2>
                <p className={styles.productDesc}>
                  Comprehensive medical coverage for employees and their dependents.
                </p>

                <div className={styles.productFeatures}>
                  <h3>Coverage Includes</h3>
                  <ul>
                    <li>Hospitalization expenses</li>
                    <li>Pre and post hospitalization</li>
                    <li>Day care procedures</li>
                    <li>Cashless treatment at network hospitals</li>
                    <li>Annual health check-ups</li>
                  </ul>
                </div>

                <div className={styles.productIdealFor}>
                  <h3>Benefits</h3>
                  <p>
                    Flexible sum insured options, family coverage, and employee wellness support.
                  </p>
                </div>

                <CTAButton href="/contact" variant="primary">
                  Get Quote
                </CTAButton>
              </div>
            </div>

            {/* Group Term Life Insurance */}
            <div className={styles.productItem} id="group-term-life">
              <div className={styles.productContent}>
                <span className={styles.productIcon}><FaBriefcase /></span>
                <h2>Group Term Life Insurance</h2>
                <p className={styles.productDesc}>
                  Life insurance coverage offering financial security to employees&apos; families.
                </p>

                <div className={styles.productFeatures}>
                  <h3>Benefits</h3>
                  <ul>
                    <li>High sum assured at affordable premiums</li>
                    <li>Annual renewable policies</li>
                    <li>Employer and employee contribution options</li>
                    <li>No medical check-up for group coverage</li>
                    <li>Tax benefits under Income Tax Act</li>
                  </ul>
                </div>

                <div className={styles.productIdealFor}>
                  <h3>Coverage</h3>
                  <p>
                    Financial protection for families in case of unfortunate death of the
                    employee during policy term.
                  </p>
                </div>

                <CTAButton href="/contact" variant="primary">
                  Get Quote
                </CTAButton>
              </div>
            </div>

            {/* Workmen Compensation Insurance */}
            <div className={styles.productItem} id="workmen-compensation">
              <div className={styles.productContent}>
                <span className={styles.productIcon}><GiGearStickPattern /></span>
                <h2>Workmen Compensation Insurance</h2>
                <p className={styles.productDesc}>
                  Mandatory insurance protecting employers from statutory liabilities.
                </p>

                <div className={styles.productFeatures}>
                  <h3>Covers</h3>
                  <ul>
                    <li>Workplace injury or illness</li>
                    <li>Legal compensation expenses</li>
                    <li>Medical treatment costs</li>
                    <li>Disability compensation</li>
                    <li>Funeral expenses</li>
                  </ul>
                </div>

                <div className={styles.productIdealFor}>
                  <h3>Required For</h3>
                  <p>
                    All employers with workers under the Workmen Compensation Act, especially
                    manufacturing, construction, and industrial units.
                  </p>
                </div>

                <CTAButton href="/contact" variant="primary">
                  Get Quote
                </CTAButton>
              </div>
            </div>

            {/* OPD and Wellness Plans */}
            <div className={styles.productItem} id="opd-wellness">
              <div className={styles.productContent}>
                <span className={styles.productIcon}><MdHealthAndSafety /></span>
                <h2>OPD and Wellness Plans</h2>
                <p className={styles.productDesc}>
                  Preventive healthcare solutions that promote employee well-being.
                </p>

                <div className={styles.productFeatures}>
                  <h3>Includes</h3>
                  <ul>
                    <li>Doctor consultations</li>
                    <li>Diagnostics and pharmacy benefits</li>
                    <li>Health checkups</li>
                    <li>Wellness programs</li>
                    <li>Preventive care coverage</li>
                  </ul>
                </div>

                <div className={styles.productIdealFor}>
                  <h3>Advantages</h3>
                  <p>
                    Reduces absenteeism, improves productivity, and promotes a healthy workforce
                    through preventive care.
                  </p>
                </div>

                <CTAButton href="/contact" variant="primary">
                  Get Quote
                </CTAButton>
              </div>
            </div>

            {/* Customized Solutions */}
            <div className={styles.productItem} id="custom-solutions">
              <div className={styles.productContent}>
                <span className={styles.productIcon}><BiSpa /></span>
                <h2>Customized Corporate Insurance Solutions</h2>
                <p className={styles.productDesc}>
                  Tailor-made insurance plans based on industry, workforce size, and risk profile.
                </p>

                <div className={styles.productFeatures}>
                  <h3>What We Offer</h3>
                  <ul>
                    <li>Industry-specific coverage design</li>
                    <li>Flexible policy structures</li>
                    <li>Multi-product bundling options</li>
                    <li>Scalable solutions for growth</li>
                    <li>Specialized risk assessment</li>
                  </ul>
                </div>

                <div className={styles.productIdealFor}>
                  <h3>Perfect For</h3>
                  <p>
                    Organizations with unique requirements, high-risk industries, or those seeking
                    comprehensive employee benefit packages.
                  </p>
                </div>

                <CTAButton href="/contact" variant="primary">
                  Get Quote
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
