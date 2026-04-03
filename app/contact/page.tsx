'use client';

import { useState } from 'react';
import styles from './contact.module.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    employees: '',
    product: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      // Clear form immediately after successful submission
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        employees: '',
        product: '',
        message: ''
      });

      // Show success message
      setIsSubmitted(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className="animate-fade-in-up">Get in Touch</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Protect your workforce with the right insurance solutions
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2>Contact Information</h2>
              <p className={styles.contactDesc}>
                Have questions? We&apos;re here to help. Reach out to us through any of these channels.
              </p>

              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}><FaPhoneAlt /></span>
                  <div>
                    <h3>Phone</h3>
                    <p>+91 7680064255</p>
                    <p className={styles.subtext}>Mon-Sat, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}><FaEnvelope /></span>
                  <div>
                    <h3>Email</h3>
                    <p>info@bharatcover.net</p>
                    <p className={styles.subtext}>We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}><FaMapMarkerAlt /></span>
                  <div>
                    <h3>Office Address</h3>
                    <p>1st Floor, Phase II, Ratnam chambers, H.No. 1-62/172, Plot No.172, Kavuri Hills, Madhapur, Hyderabad, Telangana 500033</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}><FaWhatsapp /></span>
                  <div>
                    <h3>WhatsApp</h3>
                    <p>+91 7680064255</p>
                    <p className={styles.subtext}>Quick response via WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.contactForm}>
              <h2>Request a Quote</h2>
              <p className={styles.formDesc}>
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {isSubmitted && (
                <div className={styles.successMessage}>
                  ✓ Thank you! Your enquiry has been submitted successfully. We&apos;ll contact you soon.
                </div>
              )}

              {error && (
                <div className={styles.errorMessage}>
                  ✗ {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="companyName">Company Name *</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contactPerson">Contact Person *</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="employees">Number of Employees *</label>
                    <input
                      type="text"
                      id="employees"
                      name="employees"
                      value={formData.employees}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="product">Product Interested In *</label>
                    <select
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a product</option>
                      <option value="personal-accident">Personal Accident Insurance</option>
                      <option value="group-health">Group Health Insurance</option>
                      <option value="group-term-life">Group Term Life Insurance</option>
                      <option value="workmen-compensation">Workmen Compensation</option>
                      <option value="opd-wellness">OPD & Wellness Plans</option>
                      <option value="custom">Customized Solution</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
