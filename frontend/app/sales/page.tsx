'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PA_SI_OPTIONS } from '@/lib/pa-quote';
import styles from './sales.module.css';

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState('pa'); // 'pa' or 'hdc'
  const [paSI, setPaSI] = useState(1000000);
  const [paBasePrem, setPaBasePrem] = useState(200);
  const [paGstPrem, setPaGstPrem] = useState(236);
  const [includeGstPa, setIncludeGstPa] = useState(true);

  const [hdcPlan, setHdcPlan] = useState(1);
  const [includeGstHdc, setIncludeGstHdc] = useState(true);
  
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const selectSI = (amt: number, base: number, gst: number) => {
    setPaSI(amt);
    setPaBasePrem(base);
    setPaGstPrem(gst);
  };

  const hdcData = {
    1: { name: 'Plan A', base: 72, gst: 85, ward: 500, icu: 1000, max: 30000 },
    2: { name: 'Plan B', base: 144, gst: 170, ward: 1000, icu: 2000, max: 60000 }
  };

  return (
    <div className={styles.salesBody}>
      {/* Product Tabs */}
      <div className={styles.prodTabBar}>
        <div 
          className={`${styles.prodTab} ${activeTab === 'pa' ? styles.active : ''}`}
          onClick={() => setActiveTab('pa')}
        >
          🛡️ Personal Accident Cover
          <span className={styles.tabBadge}>SBI General / Go Digit</span>
        </div>
        <div 
          className={`${styles.prodTab} ${activeTab === 'hdc' ? styles.active : ''}`}
          onClick={() => setActiveTab('hdc')}
        >
          🏥 Hospital Daily Cash
          <span className={styles.tabBadge}>SBI General</span>
        </div>
      </div>

      {/* PA PAGE */}
      {activeTab === 'pa' && (
        <div className={styles.layout}>
          <div className={styles.leftCol}>
            <div className={styles.prodHero}>
              <div className={styles.heroRing}></div>
              <div className={styles.heroRing2}></div>
              <div className={styles.heroInsurerRow}>
                <div className={styles.insurerPill}><span className={styles.dot}></span> SBI General Insurance</div>
                <div className={styles.insurerPill}><span className={styles.dot}></span> Go Digit — upto ₹15L</div>
                <div className={styles.planPill}>Plan 1A</div>
              </div>
              <h1>Personal Accident <em>Cover</em></h1>
              <p className={styles.heroSub}>Round-the-clock protection for you and your family against accidental death, permanent disability, and partial disability — affordable annual plans starting at ₹24 with GST.</p>
              <div className={styles.metaChips}>
                <div className={styles.metaChip}>👤 Age: 18–65 Years (Unit Rate)</div>
                <div className={styles.metaChip}>📅 Tenure: 1 Year (12 Months)</div>
                <div className={styles.metaChip}>🇮🇳 Pan-India Coverage</div>
                <div className={styles.metaChip}>✅ No Medical Checkup Required</div>
              </div>
            </div>

                <div className={styles.sectionCard}>
                  <div className={styles.cardTitle}>
                    <div className={`${styles.cardTitleIcon} ${styles.iconSage}`}>✅</div>
                    <div>
                      <h2>What&apos;s Covered</h2>
                      <p>Core benefits included in all Personal Accident plans</p>
                    </div>
                  </div>
                  <div className={styles.coverageGrid}>
                    <div className={styles.covItem}>
                      <div className={styles.covCheck}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                      <div className={styles.covText}>
                        <h4>Accidental Death (AD)</h4>
                        <p>Full sum insured paid to nominee in the event of death caused directly by an accident.</p>
                      </div>
                    </div>
                    <div className={styles.covItem}>
                      <div className={styles.covCheck}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                      <div className={styles.covText}>
                        <h4>Permanent Total Disability (PTD)</h4>
                        <p>100% sum insured paid for loss of both limbs, both eyes, or one limb + one eye due to accident.</p>
                      </div>
                    </div>
                    <div className={styles.covItem}>
                      <div className={styles.covCheck}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                      <div className={styles.covText}>
                        <h4>Permanent Partial Disability (PPD)</h4>
                        <p>Proportionate benefit as per the Schedule of Benefits — loss of specific limbs or sensory organs.</p>
                      </div>
                    </div>
                    <div className={styles.covItem}>
                      <div className={styles.covCheck}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                      <div className={styles.covText}>
                        <h4>24/7 Worldwide Coverage</h4>
                        <p>Coverage is active round-the-clock — at work, at home, travelling — anywhere in the world.</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.highlightNote}>
                    <span>💡</span>
                    <span>No waiting period applies on Personal Accident plans. Coverage begins from Day 1 of the policy. No pre-medical examination required for sum insured up to ₹15 Lakh.</span>
                  </div>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.cardTitle}>
                    <div className={`${styles.cardTitleIcon} ${styles.iconIndigo}`}>₹</div>
                    <div>
                      <h2>Premium at a Glance</h2>
                      <p>Annual premium across all sum insured options — unit rate for ages 18–65</p>
                    </div>
                  </div>
                  <table className={styles.premiumTable}>
                    <thead>
                      <tr>
                        <th>Sum Insured</th>
                        <th>Coverage</th>
                        <th>Base Premium</th>
                        <th>Premium + GST (18%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className={styles.siVal}>₹1,00,000</span></td>
                        <td style={{ fontSize: '13px', color: '#6E7E94' }}>AD + PTD + PPD</td>
                        <td><span className={styles.premVal}>₹20 / yr</span></td>
                        <td><span className={styles.premGst}>₹24 / yr</span></td>
                      </tr>
                      <tr>
                        <td><span className={styles.siVal}>₹5,00,000</span></td>
                        <td style={{ fontSize: '13px', color: '#6E7E94' }}>AD + PTD + PPD</td>
                        <td><span className={styles.premVal}>₹100 / yr</span></td>
                        <td><span className={styles.premGst}>₹118 / yr</span></td>
                      </tr>
                      <tr>
                        <td><span className={styles.siVal}>₹10,00,000</span></td>
                        <td style={{ fontSize: '13px', color: '#6E7E94' }}>AD + PTD + PPD</td>
                        <td><span className={styles.premVal}>₹200 / yr</span></td>
                        <td><span className={styles.premGst}>₹236 / yr</span></td>
                      </tr>
                      <tr>
                        <td><span className={styles.siVal}>₹15,00,000</span></td>
                        <td style={{ fontSize: '13px', color: '#6E7E94' }}>AD + PTD + PPD</td>
                        <td><span className={styles.premVal}>₹300 / yr</span></td>
                        <td><span className={styles.premGst}>₹354 / yr</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <p className={styles.tableNote}>⚡ <strong>Unit Rate</strong> — same premium applies to all ages between 18 and 65 years. GST at 18% is applicable on the base premium. Premiums are for individual annual policies.</p>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.cardTitle}>
                    <div className={`${styles.cardTitleIcon} ${styles.iconSky}`}>❓</div>
                    <div><h2>Frequently Asked Questions</h2></div>
                  </div>
                  <div className={`${styles.faqItem} ${openFaq === 0 ? styles.faqItemOpen : ''}`}>
                    <div className={styles.faqQ} onClick={() => toggleFaq(0)}>
                      Is there a waiting period for Personal Accident cover?
                      <div className={styles.faqArrow}>↓</div>
                    </div>
                    <div className={styles.faqA}>No — Personal Accident policies have no waiting period. Coverage begins from Day 1 of the policy inception date. There are no exclusions for pre-existing conditions in PA policies since it only covers accidents, not illnesses.</div>
                  </div>
                  <div className={`${styles.faqItem} ${openFaq === 1 ? styles.faqItemOpen : ''}`}>
                    <div className={styles.faqQ} onClick={() => toggleFaq(1)}>
                      Can I buy this for my family members too?
                      <div className={styles.faqArrow}>↓</div>
                    </div>
                    <div className={styles.faqA}>Yes. You can purchase individual PA policies for each family member — spouse, children, and parents — with separate sum insured for each. Group PA (for families) is also available with discounted premiums.</div>
                  </div>
                </div>
          </div>

          <div className={styles.sidebar}>
                <div className={styles.calcCard}>
                  <div className={styles.calcHeader}>
                    <h3>Premium Calculator</h3>
                    <div className={styles.planTag}>Plan 1A</div>
                  </div>
                  <div className={styles.siSelector}>
                    <label>Select Sum Insured</label>
                    <div className={styles.siOptions}>
                      {PA_SI_OPTIONS.map((opt) => (
                        <div
                          key={opt.amt}
                          className={`${styles.siOpt} ${paSI === opt.amt ? styles.siOptSelected : ''}`}
                          onClick={() => selectSI(opt.amt, opt.base, opt.gst)}
                        >
                          <span className={styles.siAmt}>{opt.short}</span>
                          <span className={styles.siLabel}>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.gstToggle} onClick={() => setIncludeGstPa(!includeGstPa)}>
                    <span>Include GST (18%)</span>
                    <div className={`${styles.toggleSwitch} ${includeGstPa ? styles.toggleSwitchOn : ''}`}>
                      <div className={styles.toggleKnob}></div>
                    </div>
                  </div>
                  <div className={styles.premiumDisplay}>
                    <div className={styles.premYearLabel}>Annual Premium</div>
                    <div className={styles.premAmount}><sup>₹</sup>{includeGstPa ? paGstPrem : paBasePrem}</div>
                    <div className={styles.premSub}>{includeGstPa ? `Includes 18% GST · ₹${paBasePrem} base` : `Excludes GST · ₹${paBasePrem} base`}</div>
                    <div className={styles.premBreakdown}>
                      <div className={styles.premBreakItem}>
                        <div className={styles.premBreakVal}>₹{((includeGstPa ? paGstPrem : paBasePrem) / 12).toFixed(2)}</div>
                        <div className={styles.premBreakLabel}>Per Month</div>
                      </div>
                      <div className={styles.premBreakItem}>
                        <div className={styles.premBreakVal}>₹{paSI.toLocaleString('en-IN')}</div>
                        <div className={styles.premBreakLabel}>Sum Insured</div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/sales/quote?si=${paSI}&gst=${includeGstPa ? '1' : '0'}`}
                    className={styles.quoteBtn}
                  >
                    Buy Now →
                  </Link>
                  <button type="button" className={styles.talkBtn}>📞 Speak to an Advisor</button>
                </div>

                <div className={styles.trustStrip}>
                  <h4>Why BharatCover</h4>
                  <div className={styles.trustItems}>
                    <div className={styles.trustItem}><span className={styles.trustIcon}>✅</span> SBI General — A+ rated insurer</div>
                    <div className={styles.trustItem}><span className={styles.trustIcon}>⚡</span> Policy issued within minutes</div>
                    <div className={styles.trustItem}><span className={styles.trustIcon}>🤝</span> Dedicated claims support</div>
                  </div>
                </div>
          </div>
        </div>
      )}

      {/* HDC PAGE */}
      {activeTab === 'hdc' && (
        <div className={styles.layout}>
          <div className={styles.leftCol}>
            <div className={styles.prodHero} style={{ background: 'linear-gradient(135deg,#1B4F82 0%,#1B3C78 100%)' }}>
              <div className={styles.heroRing}></div>
              <div className={styles.heroRing2}></div>
              <div className={styles.heroInsurerRow}>
                <div className={styles.insurerPill}><span className={styles.dot}></span> SBI General Insurance</div>
                <div className={styles.planPill}>Plan 1A · Health Indemnity</div>
              </div>
              <h1>Hospital <em>Daily Cash</em></h1>
              <p className={styles.heroSub}>A daily cash benefit paid directly to you during hospitalisation — covering routine ward days and ICU stays. Helps offset loss of income and out-of-pocket expenses during recovery.</p>
              <div className={styles.metaChips}>
                <div className={styles.metaChip}>👤 Age: 18–65 Years (Unit Rate)</div>
                <div className={styles.metaChip}>📅 Tenure: 1 Year (12 Months)</div>
                <div className={styles.metaChip}>🏥 Individual Basis</div>
                <div className={styles.metaChip}>⚠️ Waiting Periods Apply</div>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.cardTitle}>
                <div className={`${styles.cardTitleIcon} ${styles.iconSage}`}>✅</div>
                <div>
                  <h2>What&apos;s Covered</h2>
                  <p>Benefits paid per day of hospitalisation — directly to you</p>
                </div>
              </div>
              <div className={styles.coverageGrid}>
                <div className={styles.covItem}>
                  <div className={styles.covCheck}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                  <div className={styles.covText}>
                    <h4>Hospital Daily Cash</h4>
                    <p>A fixed cash benefit for each day you are hospitalised, for a maximum of 30 days per policy year.</p>
                  </div>
                </div>
                <div className={styles.covItem}>
                  <div className={styles.covCheck} style={{ background: '#FDEDEC' }}><svg viewBox="0 0 24 24" style={{ stroke: '#E74C3C' }}><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                  <div className={styles.covText}>
                    <h4>ICU Daily Cash — Double Benefit</h4>
                    <p>Double the daily benefit for every ICU day — paid for a maximum of 15 days per year.</p>
                  </div>
                </div>
              </div>
            </div>

            {[1, 2].map((p) => {
              const data = hdcData[p as 1 | 2];
              return (
                <div 
                  key={p}
                  className={`${styles.dailyCashRow} ${hdcPlan === p ? styles.dailyCashRowSelected : ''}`}
                  onClick={() => setHdcPlan(p)}
                >
                  <div className={styles.dcrBadge}>{p === 1 ? 'PLAN A' : 'PLAN B'}</div>
                  <div className={styles.dcrHeader}>
                    <div className={styles.dcrLeft}>
                      <h3>{data.name} Daily Cash Plan</h3>
                      <div className={styles.dcrSub}>₹{data.ward} per day for ward &nbsp;·&nbsp; ₹{data.icu} per day for ICU</div>
                    </div>
                    <div className={styles.dcrPrems}>
                      <div className={styles.premLabel}>Annual Premium</div>
                      <div className={styles.premBig}>₹{data.gst}</div>
                      <div className={styles.premGst}>incl. 18% GST</div>
                    </div>
                  </div>
                  <div className={styles.selectedIndicator}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                </div>
              );
            })}
          </div>

          <div className={styles.sidebar}>
            <div className={styles.calcCard}>
              <div className={styles.calcHeader}>
                <h3>Your Selected Plan</h3>
                <div className={styles.planTag}>Health Indemnity</div>
              </div>
              <div className={styles.planSelector}>
                <label>Choose Benefit Level</label>
                <div className={`${styles.planOpt} ${hdcPlan === 1 ? styles.planOptSelected : ''}`} onClick={() => setHdcPlan(1)}>
                  <h4>Plan A — Standard</h4>
                  <div className={styles.planBenefit}>₹500/day ward · ₹1,000/day ICU</div>
                </div>
                <div className={`${styles.planOpt} ${hdcPlan === 2 ? styles.planOptSelected : ''}`} onClick={() => setHdcPlan(2)}>
                  <h4>Plan B — Enhanced</h4>
                  <div className={styles.planBenefit}>₹1,000/day ward · ₹2,000/day ICU</div>
                </div>
              </div>
              <div className={styles.gstToggle} onClick={() => setIncludeGstHdc(!includeGstHdc)}>
                <span>Include GST (18%)</span>
                <div className={`${styles.toggleSwitch} ${includeGstHdc ? styles.toggleSwitchOn : ''}`}>
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>
              <div className={styles.premiumDisplay}>
                <div className={styles.premYearLabel}>Annual Premium</div>
                <div className={styles.premAmount}><sup>₹</sup>{includeGstHdc ? hdcData[hdcPlan as 1 | 2].gst : hdcData[hdcPlan as 1 | 2].base}</div>
              </div>
              <Link href="/sales" className={styles.quoteBtn}>Get Instant Quote →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
