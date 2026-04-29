'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PA_SI_OPTIONS, type PaSiAmount } from '@/lib/pa-quote';
import styles from './accident.module.css';

type RiderPlanKey = '500' | '1000';

const RIDER_PLANS: Record<RiderPlanKey, { price: number; ward: string; icu: string; max: string }> = {
  '500': { price: 85, ward: '₹500/day', icu: '₹1,000/day', max: '30 days' },
  '1000': { price: 170, ward: '₹1,000/day', icu: '₹2,000/day', max: '30 days' },
};

function formatINR(amount: number) {
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
}

export default function AccidentPremiumCalculator() {
  const [selectedSI, setSelectedSI] = useState<PaSiAmount>(1000000);
  const [includeGst, setIncludeGst] = useState(true);
  const [riderEnabled, setRiderEnabled] = useState(false);
  const [riderPlan, setRiderPlan] = useState<RiderPlanKey>('500');

  const selected = useMemo(
    () => PA_SI_OPTIONS.find((opt) => opt.amt === selectedSI) ?? PA_SI_OPTIONS[2],
    [selectedSI],
  );

  const basePremium = includeGst ? selected.gst : selected.base;
  const riderPrice = riderEnabled ? RIDER_PLANS[riderPlan].price : 0;
  const totalPremium = basePremium + riderPrice;
  const monthlyPremium = (totalPremium / 12).toFixed(2);

  let premSubText: string;
  if (riderPrice > 0) {
    premSubText = `Base: ₹${basePremium} + Rider: ₹${riderPrice} = Total: ₹${totalPremium}`;
  } else if (includeGst) {
    premSubText = `Includes 18% GST · ₹${selected.base} base`;
  } else {
    premSubText = 'Base premium · GST excluded';
  }

  const quoteHref = `/sales/quote?si=${selectedSI}&gst=${includeGst ? '1' : '0'}`;

  return (
    <>
      <div className={styles.calcCard} id="pa-quote">
        <div className={styles.calcHeader}>
          <h3>Premium Calculator</h3>
          <span className={styles.planTag}>Plan 1A</span>
        </div>

        <div className={styles.siSelector}>
          <label>Select Sum Insured</label>
          <div className={styles.siOptions}>
            {PA_SI_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.amt}
                className={`${styles.siOpt} ${selectedSI === opt.amt ? styles.siOptSelected : ''}`}
                onClick={() => setSelectedSI(opt.amt as PaSiAmount)}
              >
                <span className={styles.siAmt}>{opt.short}</span>
                <span className={styles.siLabel}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.gstToggle}
          onClick={() => setIncludeGst((prev) => !prev)}
          aria-pressed={includeGst}
        >
          <span>Include GST (18%)</span>
          <span className={`${styles.toggleSwitch} ${includeGst ? styles.toggleSwitchOn : ''}`}>
            <span className={styles.toggleKnob} />
          </span>
        </button>

        <div className={styles.premiumDisplay}>
          <div className={styles.premYearLabel}>Annual Premium</div>
          <div className={styles.premAmount}>
            <sup>₹</sup>
            {totalPremium}
          </div>
          <div className={styles.premSub}>{premSubText}</div>
          <div className={styles.premBreakdown}>
            <div className={styles.premBreakItem}>
              <div className={styles.premBreakVal}>₹{monthlyPremium}</div>
              <div className={styles.premBreakLabel}>Per Month</div>
            </div>
            <div className={styles.premBreakItem}>
              <div className={styles.premBreakVal}>{formatINR(selectedSI)}</div>
              <div className={styles.premBreakLabel}>Sum Insured</div>
            </div>
            <div className={styles.premBreakItem}>
              <div className={styles.premBreakVal}>12 mo</div>
              <div className={styles.premBreakLabel}>Duration</div>
            </div>
          </div>
        </div>

        <Link href={quoteHref} className={styles.quoteBtn}>
          Buy Now →
        </Link>
        <button type="button" className={styles.talkBtn}>
          📞 Speak to an Advisor
        </button>

        <div className={styles.policyTermsRow}>
          <a
            href="https://www.sbigeneral.com"
            target="_blank"
            rel="noreferrer"
            className={styles.policyTermsLink}
          >
            📋 View Policy Terms &amp; Conditions
          </a>
          <a href="#" className={styles.policyTermsLink}>
            📄 Download Brochure (PDF)
          </a>
        </div>
      </div>

      <div className={`${styles.riderCard} ${riderEnabled ? styles.riderCardActive : ''}`}>
        <div className={styles.riderHeader}>
          <div className={styles.riderIcon}>💊</div>
          <div>
            <div className={styles.riderTitle}>Add Rider: Hospital Daily Cash</div>
            <div className={styles.riderSub}>SBI General Insurance · Optional Add-on</div>
          </div>
          <label className={styles.riderToggleWrap}>
            <input
              type="checkbox"
              checked={riderEnabled}
              onChange={(e) => setRiderEnabled(e.target.checked)}
            />
            <span className={styles.riderToggleTrack}>
              <span className={styles.riderToggleKnob} />
            </span>
          </label>
        </div>
        {riderEnabled ? (
          <div className={styles.riderBody}>
            <p className={styles.riderDesc}>
              Receive a fixed daily cash benefit for every day of hospitalisation — use it for food,
              transport or lost income. ICU days pay double.
            </p>
            <div className={styles.riderOpts}>
              {(Object.keys(RIDER_PLANS) as RiderPlanKey[]).map((key) => {
                const plan = RIDER_PLANS[key];
                const isSelected = riderPlan === key;
                return (
                  <button
                    type="button"
                    key={key}
                    className={`${styles.riderOpt} ${isSelected ? styles.riderOptSelected : ''}`}
                    onClick={() => setRiderPlan(key)}
                  >
                    <div className={styles.riderOptTop}>
                      <span className={styles.riderOptName}>{plan.ward}</span>
                      <span className={styles.riderOptPrice}>+₹{plan.price}/yr</span>
                    </div>
                    <div className={styles.riderOptSub}>
                      Normal · ICU: {plan.icu} · Max {plan.max}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className={styles.riderWaiting}>
              ⏱ 30-day initial waiting period applies on illness claims
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.trustStrip}>
        <h4>Why BharatCover</h4>
        <div className={styles.trustItems}>
          <div className={styles.trustItem}>
            <div className={`${styles.trustIcon} ${styles.trustIconTeal}`}>✅</div>
            SBI General — A+ rated insurer
          </div>
          <div className={styles.trustItem}>
            <div className={`${styles.trustIcon} ${styles.trustIconSky}`}>⚡</div>
            Policy issued within minutes
          </div>
          <div className={styles.trustItem}>
            <div className={`${styles.trustIcon} ${styles.trustIconTeal}`}>🤝</div>
            Dedicated claims support
          </div>
          <div className={styles.trustItem}>
            <div className={`${styles.trustIcon} ${styles.trustIconTeal}`}>🇮🇳</div>
            IRDA licensed intermediary
          </div>
          <div className={styles.trustItem}>
            <div className={`${styles.trustIcon} ${styles.trustIconNavy}`}>📋</div>
            No hidden charges
          </div>
        </div>
      </div>

      <div className={styles.relatedSection}>
        <h4 className={styles.relatedHeading}>Also Consider</h4>
        <div className={styles.relatedGrid}>
          <Link href="/personal/health-insurance" className={styles.relatedCard}>
            <span className={styles.rcIcon}>🏥</span>
            <h4>Hospital Daily Cash</h4>
            <p>₹500–₹1000/day during hospitalisation</p>
            <span className={styles.rcNew}>View Plan</span>
          </Link>
          <Link href="/personal/health-insurance" className={styles.relatedCard}>
            <span className={styles.rcIcon}>❤️</span>
            <h4>Health Insurance</h4>
            <p>Comprehensive individual &amp; family plans</p>
            <span className={styles.rcNew}>View Plan</span>
          </Link>
        </div>
      </div>
    </>
  );
}
