import Link from 'next/link';
import { FiArrowLeft, FiShield } from 'react-icons/fi';
import '@/styles/policy.css';

export default function PrivacyPage() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-card">
          <Link href="/" className="policy-back-link">
            <FiArrowLeft />
            Back to Home
          </Link>

          <div className="policy-header">
            <div className="policy-icon policy-icon-privacy">
              <FiShield />
            </div>
            <div className="policy-title-wrapper">
              <h1 className="policy-title">Privacy Policy</h1>
              <p className="policy-updated">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="policy-content">
            <section className="policy-section">
              <h2 className="policy-section-title">1. Introduction</h2>
              <p>
                Bharat Cover ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
                please do not access the site or use our services.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">2. Information We Collect</h2>
              <p className="policy-subsection-title">Personal Information</p>
              <p>We collect information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Submit an inquiry through our contact form</li>
                <li>Request insurance quotes or information</li>
                <li>Apply for insurance policies</li>
                <li>Communicate with us via email or phone</li>
              </ul>
              <p>This information may include:</p>
              <ul>
                <li>Company name and business information</li>
                <li>Contact person name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Number of employees</li>
                <li>Insurance product preferences</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <p className="policy-subsection-title">Automatically Collected Information</p>
              <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
              <ul>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To process insurance applications and provide quotes</li>
                <li>To communicate with you about our services</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
                <li>To prevent fraud and ensure security</li>
                <li>To send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">4. Information Sharing and Disclosure</h2>
              <p>We may share your information in the following circumstances:</p>
              <ul>
                <li>
                  <strong>Insurance Providers:</strong> We share necessary information with insurance companies to process
                  your applications and obtain quotes
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share information with third-party service providers who
                  perform services on our behalf (e.g., website hosting, analytics)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our
                  rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your
                  information may be transferred
                </li>
              </ul>
              <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your information against
                unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul>
                <li>Secure SSL encryption for data transmission</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                privacy policy, unless a longer retention period is required or permitted by law. When we no longer need
                your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">7. Your Rights</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your information</li>
                <li><strong>Objection:</strong> Object to processing of your information</li>
                <li><strong>Portability:</strong> Request transfer of your information to another service</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for processing (where applicable)</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided below.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">8. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and improve user experience.
                Cookies are small data files stored on your device. You can configure your browser to refuse cookies or
                alert you when cookies are being sent.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">9. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices
                or content of these external sites. We encourage you to review the privacy policies of any third-party
                sites you visit.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">10. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal
                information from children. If we become aware that we have collected information from a child without
                parental consent, we will take steps to delete that information.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this
                Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">12. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
              <div className="policy-contact-box">
                <p className="policy-contact-name">Bharat Cover</p>
                <p>Email: privacy@bharatcover.net</p>
                <p>Phone: +91 7680064255</p>
                <p>For data protection inquiries, you may also contact our Data Protection Officer at: dpo@bharatcover.net</p>
              </div>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">13. Compliance</h2>
              <p>
                We are committed to complying with applicable data protection laws, including the Information Technology
                Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive
                Personal Data or Information) Rules, 2011 of India.
              </p>
            </section>
          </div>

          <div className="policy-footer">
            <div className="policy-footer-box">
              <p className="policy-footer-text">
                By using our services, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
