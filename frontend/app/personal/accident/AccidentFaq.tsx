'use client';

import { useState } from 'react';
import styles from './accident.module.css';

type FaqItem = {
  q: string;
  a: string;
};

const FAQS: FaqItem[] = [
  {
    q: 'Is there a waiting period for Personal Accident cover?',
    a: 'No — Personal Accident policies have no waiting period. Coverage begins from Day 1 of the policy inception date. There are no exclusions for pre-existing conditions in PA policies since it only covers accidents, not illnesses.',
  },
  {
    q: 'Can I buy this for my family members too?',
    a: 'Yes. You can purchase individual PA policies for each family member — spouse, children, and parents — with separate sum insured for each. Group PA (for families) is also available with discounted premiums.',
  },
  {
    q: 'What counts as an "accident" under this policy?',
    a: 'An accident is defined as a sudden, unexpected, external, and involuntary event. This includes road accidents, falls, burns, drowning, and other physical mishaps. It does not include self-inflicted injuries or death due to illness.',
  },
  {
    q: 'What is PTD vs PPD benefit?',
    a: 'PTD (Permanent Total Disability) pays 100% of sum insured for complete loss of use of both hands, both legs, or combination of limb and eye. PPD (Permanent Partial Disability) pays a proportionate percentage as per the insurer\'s Schedule of Benefits — typically 10% to 50% depending on the body part or organ affected.',
  },
  {
    q: 'How do I file a claim under Bharat Suraksha PA Cover?',
    a: 'To file a claim: (1) Inform BharatCover or SBI General within 7 days of the accident. (2) Submit the claim form along with FIR (if applicable), medical reports, discharge summary, and identity proof. (3) For death claims, include the death certificate and post-mortem report. Claims are typically settled within 15–30 working days of receiving complete documents. You can also initiate claims via the BharatCover helpline or WhatsApp.',
  },
  {
    q: 'Am I covered if an accident happens while travelling abroad?',
    a: 'Yes — SBI General\'s Personal Accident policy provides worldwide coverage. If you meet with an accident outside India, you are covered for accidental death and disability under the same terms. However, medical expense reimbursement (if opted) may have specific terms for international claims. Keep all original foreign medical documents, translated to English if needed.',
  },
  {
    q: 'What documents do I need to buy this policy?',
    a: 'For most PA policies with sum insured up to ₹15 Lakh, no medical examination is required. You will need: (1) Identity proof (Aadhaar, PAN, Passport or Voter ID), (2) Address proof, (3) Recent passport-size photograph, and (4) Bank account details for premium payment. The policy is typically issued digitally within minutes.',
  },
  {
    q: 'Can I cancel the policy and get a refund?',
    a: 'Yes. During the free-look period (15 days from policy receipt), you can cancel for a full refund minus stamp duty and proportionate risk premium for days on cover. After 15 days, short-period cancellation refund applies on a pro-rata basis. If a claim has been made, no refund is payable on cancellation.',
  },
  {
    q: 'Is my occupation relevant? Do high-risk jobs pay more premium?',
    a: 'Yes — occupations are classified into risk categories (Class 1 to 4). Class 1 (sedentary/office work) pays the standard rate. Class 2-3 (field work, tradespeople) may pay a loading of 50–100%. Class 4 (mining, explosives, deep-sea work) may pay 2x or be declined. Most salaried and self-employed individuals fall under Class 1–2 and qualify for standard rates.',
  },
  {
    q: 'What is the maximum sum insured available?',
    a: 'Under SBI General\'s PA product, sum insured up to ₹15 Lakh is available through BharatCover without additional documentation. Go Digit offers coverage up to ₹15 Lakh for individuals. Higher SI (up to ₹1 Crore) may be available for certain occupations and requires underwriting approval. Contact our advisors for high-SI requirements.',
  },
];

export default function AccidentFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div>
      {FAQS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
          >
            <button
              type="button"
              className={styles.faqQ}
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              {item.q}
              <span className={styles.faqArrow}>↓</span>
            </button>
            <div className={styles.faqA}>{item.a}</div>
          </div>
        );
      })}
    </div>
  );
}
