import Link from 'next/link';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';
import '@/styles/policy.css';

export default function TermsPage() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-card">
          <Link href="/" className="policy-back-link">
            <FiArrowLeft />
            Back to Home
          </Link>

          <div className="policy-header">
            <div className="policy-icon policy-icon-terms">
              <FiFileText />
            </div>
            <div className="policy-title-wrapper">
              <h1 className="policy-title">Terms and Conditions</h1>
              <p className="policy-updated">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="policy-content">
            <section className="policy-section">
              <h2 className="policy-section-title">1. Agreement to Terms</h2>
              <p>
                By accessing and using Bharat Cover services, you agree to be bound by these Terms and Conditions.
                If you disagree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">2. Insurance Services</h2>
              <p>
                Bharat Cover provides group health insurance and employee benefits solutions to businesses. Our services include:
              </p>
              <ul>
                <li>Group Health Insurance (GHI)</li>
                <li>Group Term Life Insurance (GTL)</li>
                <li>Group Personal Accident (GPA)</li>
                <li>Outpatient Department (OPD) Coverage</li>
                <li>Workmen Compensation Insurance</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">3. Eligibility</h2>
              <p>
                Our services are available to registered businesses and organizations seeking employee benefit solutions.
                Individual applications must be submitted through an employer or organization.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">4. Information Accuracy</h2>
              <p>
                You agree to provide accurate, current, and complete information when submitting inquiries or applications.
                Any false or misleading information may result in termination of services or denial of claims.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">5. Policy Terms</h2>
              <p>
                Specific insurance policies are subject to individual terms and conditions as outlined in the policy documents.
                These Terms and Conditions apply to the use of our website and inquiry services.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">6. Pricing and Payment</h2>
              <p>
                Insurance premiums and pricing are determined based on various factors including number of employees,
                coverage type, and risk assessment. Final pricing will be provided in writing after assessment of your requirements.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">7. Claims Process</h2>
              <p>
                All insurance claims must be submitted according to the procedures outlined in your policy documents.
                Claims are subject to verification and approval by the insurance provider.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">8. Limitation of Liability</h2>
              <p>
                Bharat Cover acts as an intermediary between clients and insurance providers. We are not liable for
                any claims denied by insurance companies or disputes arising from policy coverage.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">9. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and images, is the property of Bharat Cover
                and protected by copyright laws. Unauthorized use is prohibited.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">10. Privacy</h2>
              <p>
                Your use of our services is also governed by our Privacy Policy. Please review our{' '}
                <Link href="/privacy" className="policy-link">Privacy Policy</Link>
                {' '}to understand how we collect and use your information.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">11. Modifications</h2>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective
                immediately upon posting on our website. Continued use of our services constitutes acceptance of modified terms.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">12. Governing Law</h2>
              <p>
                These Terms and Conditions are governed by and construed in accordance with the laws of India.
                Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City/State].
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">13. Contact Information</h2>
              <p>For questions regarding these Terms and Conditions, please contact us at:</p>
              <div className="policy-contact-box">
                <p className="policy-contact-name">Bharat Cover</p>
                <p>Email: info@bharatcover.net</p>
                <p>Phone: +91 7680064255</p>
              </div>
            </section>
          </div>

          <div className="policy-footer">
            <div className="policy-footer-box">
              <p className="policy-footer-text">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
