import type { MarketingSection } from '@/types/product-page';
import styles from './ProductMarketing.module.css';
import { MarketingLink } from './MarketingLink';
import { FaqAccordion } from './FaqAccordion';
import { ProductTabs } from './ProductTabs';
import { BusinessCtaForm } from './BusinessCtaForm';

function CheckSvg() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function MarketingSections({ sections }: { sections: MarketingSection[] }) {
  return (
    <>
      {sections.map((s, i) => {
        const key = `${s.type}-${i}`;
        switch (s.type) {
          case 'heroSplit':
            return (
              <section key={key} className={styles.heroSplit}>
                <div className={`${styles.container} ${styles.heroSplitInner}`}>
                  <div className={styles.heroSplitContent}>
                    <h1>
                      {s.headline}
                      {s.headlineEm ? <em> {s.headlineEm}</em> : null}
                    </h1>
                    <p className={styles.heroSplitSub}>
                      {s.subHighlight ? (
                        <>
                          {s.sub.split(s.subHighlight)[0]}
                          <span>{s.subHighlight}</span>
                          {s.sub.split(s.subHighlight)[1] ?? ''}
                        </>
                      ) : (
                        s.sub
                      )}
                    </p>
                    <div className={styles.heroBtnRow}>
                      {s.buttons.map((b, j) => (
                        <MarketingLink key={j} link={b} />
                      ))}
                    </div>
                  </div>
                  <div className={styles.heroSplitVisualWrap}>
                    <div className={styles.heroVisual}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image.src} alt={s.image.alt} />
                      <div className={styles.heroPriceCard}>
                        <div className={styles.hpcLabel}>{s.priceCard.label}</div>
                        <div className={styles.hpcPrice}>
                          {s.priceCard.amount.startsWith('₹') ? (
                            <>
                              <span className={styles.hpcRupee}>₹</span>
                              {s.priceCard.amount.slice(1)}
                            </>
                          ) : (
                            s.priceCard.amount
                          )}
                          {s.priceCard.period ? <span className={styles.hpcPer}>{s.priceCard.period}</span> : null}
                        </div>
                        <div className={styles.hpcPlan}>{s.priceCard.planLine}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'heroNavy':
            return (
              <section key={key} className={styles.pageHero}>
                <div className={styles.container}>
                  <div className={styles.heroInnerGrid}>
                    <div>
                      {s.tag ? <div className={styles.heroTag}>{s.tag}</div> : null}
                      <h1
                        className={styles.heroHeadline}
                        dangerouslySetInnerHTML={{ __html: s.headline }}
                      />
                      {s.productName ? <div className={styles.heroProductName}>{s.productName}</div> : null}
                      <p className={styles.heroDesc}>{s.description}</p>
                      <div className={styles.heroBtnRow}>
                        {s.buttons.map((b, j) => (
                          <MarketingLink key={j} link={b} />
                        ))}
                      </div>
                      {s.trustChips?.length ? (
                        <div className={styles.heroTrustChips}>
                          {s.trustChips.map((c, j) => (
                            <span key={j} className={styles.htc}>
                              <span className={styles.htcCheck}>✓</span> {c.text}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className={styles.heroRightCol}>
                      <div className={styles.heroVisual}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.image.src} alt={s.image.alt} />
                        <div className={styles.heroPriceCard}>
                          <div className={styles.hpcLabel}>{s.priceCard.label}</div>
                          <div className={styles.hpcPrice}>
                            <span className={styles.hpcRupee}>₹</span>
                            {s.priceCard.amount.replace(/^₹/, '')}
                            {s.priceCard.period ? <span className={styles.hpcPer}>{s.priceCard.period}</span> : null}
                          </div>
                          <div className={styles.hpcPlan}>{s.priceCard.planLine}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'sectionIntro':
            return (
              <div key={key} className={styles.container}>
                <div className={styles.sectionBlock} style={{ paddingBottom: 8 }}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.underline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                </div>
              </div>
            );

          case 'planCards':
            return (
              <section key={key} className={styles.sectionBlock}>
                <div className={styles.container}>
                  <div className={styles.cardsGrid}>
                    {s.cards.map((c, j) => (
                      <article key={j} className={styles.planCard}>
                        {c.badge ? (
                          <span
                            className={`${styles.cardBadge} ${
                              c.badge.variant === 'green' ? styles.badgeGreen : styles.badgeTeal
                            }`}
                          >
                            {c.badge.text}
                          </span>
                        ) : null}
                        <div className={styles.cardHeader}>
                          <div className={`${styles.cardIcon} ${c.iconVariant === 'navy' ? styles.iconNavy : styles.iconTeal}`}>
                            {c.icon}
                          </div>
                          <div>
                            <div className={styles.cardInsurer}>{c.insurer}</div>
                            <div className={styles.cardTag}>{c.tagLine}</div>
                          </div>
                        </div>
                        <h3 className={styles.cardTitle}>{c.title}</h3>
                        <p className={styles.cardDesc}>{c.description}</p>
                        <ul className={styles.cardBenefits}>
                          {c.benefits.map((b, k) => (
                            <li key={k} className={styles.benefitItem}>
                              <span style={{ color: 'var(--pp-teal)', fontWeight: 900 }}>✓</span>
                              <span>
                                {b.strong ? (
                                  <>
                                    <span className={styles.benefitStrong}>{b.strong}</span>
                                    {b.text ? ' — ' : ''}
                                  </>
                                ) : null}
                                {b.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className={styles.cardDivider} />
                        <div className={styles.priceRow}>
                          {c.priceRow.kind === 'from' ? (
                            <>
                              <div className={styles.priceTopRow}>
                                <span className={styles.priceFrom}>{c.priceRow.from}</span>
                                <span className={styles.priceAmount}>{c.priceRow.amount}</span>
                                <span className={styles.pricePeriod}>{c.priceRow.period}</span>
                              </div>
                              {c.priceRow.gstNote ? <span className={styles.priceGst}>{c.priceRow.gstNote}</span> : null}
                            </>
                          ) : (
                            <>
                              <div className={styles.priceTopRow}>
                                <span className={styles.priceFull}>{c.priceRow.text}</span>
                              </div>
                              {c.priceRow.gstNote ? <span className={styles.priceGst}>{c.priceRow.gstNote}</span> : null}
                            </>
                          )}
                        </div>
                        <div className={styles.siPills}>
                          {c.pills.map((p, k) => (
                            <span key={k} className={styles.siPill}>
                              {p}
                            </span>
                          ))}
                        </div>
                        {c.note ? <p className={styles.cardNote}>{c.note}</p> : null}
                        <div className={styles.cardCta}>
                          <MarketingLink link={{ ...c.cta, variant: c.cta.variant ?? 'outline-navy' }} />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'waitingTable':
            return (
              <section key={key} className={styles.sectionBlock}>
                <div className={styles.container}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.underline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                  <div className={styles.tableWrap}>
                    <table>
                      <thead>
                        <tr>
                          {s.columns.map((h, j) => (
                            <th key={j}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci}>
                                {typeof cell === 'string' ? (
                                  cell
                                ) : (
                                  <span className={styles.tdNone}>
                                    <CheckSvg /> {cell.text}
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            );

          case 'featureGrid':
            return (
              <section key={key} className={styles.sectionBlock}>
                <div className={styles.container}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.underline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                  <div className={styles.featuresGrid}>
                    {s.tiles.map((t, j) => (
                      <div key={j} className={styles.featureTile}>
                        <span className={styles.featureIcon}>{t.icon}</span>
                        <h3 className={styles.featureTitle}>{t.title}</h3>
                        <p className={styles.featureDesc}>{t.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'steps':
            return (
              <section key={key} className={styles.sectionBlock}>
                <div className={styles.container}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.underline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                  <div className={styles.stepsGrid}>
                    {s.steps.map((st, j) => (
                      <div key={j} className={styles.stepItem}>
                        <div className={styles.stepNumber}>{st.number}</div>
                        <div>
                          <h3 className={styles.stepTitle}>{st.title}</h3>
                          <p className={styles.stepDesc}>{st.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'faq':
            return (
              <section key={key} className={styles.faqSection}>
                <div className={styles.container}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.underline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                  <FaqAccordion items={s.items} />
                </div>
              </section>
            );

          case 'ctaBand':
            return (
              <section key={key} className={styles.ctaBand}>
                <h2 className={styles.ctaTitle}>{s.title}</h2>
                <p className={styles.ctaSub}>{s.sub}</p>
                <div className={styles.ctaBtns}>
                  {s.buttons.map((b, j) => (
                    <MarketingLink key={j} link={b} />
                  ))}
                </div>
              </section>
            );

          case 'serveGrid':
            return (
              <section key={key} className={styles.sectionBlock}>
                <div className={styles.container}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.tealUnderline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                  <div className={styles.serveGrid}>
                    {s.tiles.map((t, j) => (
                      <div key={j} className={styles.serveTile}>
                        <div className={styles.serveEmoji}>{t.emoji}</div>
                        <h3 className={styles.featureTitle}>{t.title}</h3>
                        <p className={styles.featureDesc}>{t.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'prodCards':
            return (
              <section key={key} className={styles.sectionBlock}>
                <div className={styles.container}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.tealUnderline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                  <div className={styles.productsGrid}>
                    {s.cards.map((c, j) => (
                      <article key={j} className={styles.prodCard}>
                        <div className={styles.prodCardTop}>
                          <div className={`${styles.prodIcon} ${c.iconBg === 'teal' ? styles.tealBg : styles.navyBg}`}>
                            {c.icon}
                          </div>
                          {c.badges?.map((b, k) => (
                            <span
                              key={k}
                              className={`${styles.prodBadge} ${
                                b.variant === 'popular'
                                  ? styles.badgePopular
                                  : b.variant === 'institutional'
                                    ? styles.badgeInstitutional
                                    : styles.badgeStatutory
                              }`}
                            >
                              {b.text}
                            </span>
                          ))}
                        </div>
                        <div className={styles.prodTag}>{c.tag}</div>
                        <h3 className={styles.prodTitle}>{c.title}</h3>
                        <p className={styles.prodDesc}>{c.description}</p>
                        <ul className={styles.prodBenefits}>
                          {c.benefits.map((line, k) => (
                            <li key={k}>
                              <span className={styles.check} />
                              {line}
                            </li>
                          ))}
                        </ul>
                        <p className={styles.prodPriceNote}>{c.priceNote}</p>
                        <MarketingLink link={{ ...c.cta, variant: c.cta.variant ?? 'teal' }} />
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'whyGrid':
            return (
              <section key={key} className={styles.sectionBlock}>
                <div className={styles.container}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.tealUnderline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                  <div className={styles.whyGrid}>
                    {s.tiles.map((t, j) => (
                      <div key={j} className={styles.whyTile}>
                        <div className={styles.featureIcon}>{t.emoji}</div>
                        <h3 className={styles.featureTitle}>{t.title}</h3>
                        <p className={styles.featureDesc}>{t.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'howSteps':
            return (
              <section key={key} className={styles.sectionBlock}>
                <div className={styles.container}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.tealUnderline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                  <div className={styles.howSteps}>
                    {s.steps.map((st, j) => (
                      <div key={j} className={styles.howStep}>
                        <div className={styles.howStepNum}>{st.num}</div>
                        <h3 className={styles.featureTitle}>{st.title}</h3>
                        <p className={styles.featureDesc}>{st.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'industries':
            return (
              <section key={key} className={styles.sectionBlock}>
                <div className={styles.container}>
                  {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                  <h2 className={styles.sectionTitle}>
                    {s.title}
                    {s.titleUnderline ? <span className={styles.tealUnderline}> {s.titleUnderline}</span> : null}
                  </h2>
                  {s.sub ? <p className={styles.sectionSub}>{s.sub}</p> : null}
                  <div className={styles.industriesGrid}>
                    {s.pills.map((p, j) => (
                      <div key={j} className={styles.industryPill}>
                        <span>{p.emoji}</span> {p.label}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'businessCta':
            return (
              <section key={key} className={styles.sectionBlock} id="cta">
                <div className={styles.container}>
                  <div className={styles.businessCtaInner}>
                    {s.label ? <span className={styles.sectionLabel}>{s.label}</span> : null}
                    <h2 className={styles.sectionTitle}>
                      {s.title}
                      {s.titleEm ? <span className={styles.tealUnderline}> {s.titleEm}</span> : null}
                    </h2>
                    <p className={styles.sectionSub} style={{ marginBottom: 0 }}>
                      {s.sub}
                    </p>
                    <BusinessCtaForm />
                  </div>
                </div>
              </section>
            );

          case 'coverageCard':
            return (
              <div key={key} className={styles.sectionCard}>
                <div className={styles.cardTitleRow}>
                  <div
                    className={`${styles.cardTitleIcon} ${
                      s.iconVariant === 'sage'
                        ? styles.iconSage
                        : s.iconVariant === 'indigo'
                          ? styles.iconIndigo
                          : s.iconVariant === 'red'
                            ? styles.iconRed
                            : s.iconVariant === 'sky'
                              ? styles.iconSky
                              : styles.iconSaffron
                    }`}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <h2>{s.title}</h2>
                    {s.subtitle ? <p>{s.subtitle}</p> : null}
                  </div>
                </div>
                <div className={styles.coverageGrid}>
                  {s.items.map((it, j) => (
                    <div key={j} className={`${styles.covItem} ${it.fullWidth ? styles.covFull : ''}`}>
                      <div className={styles.covCheck}>
                        <CheckSvg />
                      </div>
                      <div className={styles.covText}>
                        <h4>{it.title}</h4>
                        <p>{it.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {s.footerNote ? <div className={styles.highlightNote}>{s.footerNote}</div> : null}
              </div>
            );

          case 'waitGrid':
            return (
              <div key={key} className={styles.sectionCard}>
                <div className={styles.cardTitleRow}>
                  <div className={`${styles.cardTitleIcon} ${styles.iconIndigo}`}>{s.icon}</div>
                  <div>
                    <h2>{s.title}</h2>
                    {s.subtitle ? <p>{s.subtitle}</p> : null}
                  </div>
                </div>
                <div className={styles.waitGrid}>
                  {s.items.map((w, j) => (
                    <div key={j} className={styles.waitItem}>
                      <div className={styles.waitLabel}>
                        <span>{w.icon}</span> {w.label}
                      </div>
                      <div
                        className={`${styles.waitPeriod} ${w.highlight ? styles.highlight : ''} ${
                          w.noWait ? styles.noWait : ''
                        }`}
                      >
                        {w.period}
                      </div>
                    </div>
                  ))}
                </div>
                {s.callout ? <div className={styles.highlightNote} style={{ marginTop: 14 }}>{s.callout}</div> : null}
              </div>
            );

          case 'premiumTables':
            return (
              <div key={key} id={s.anchorId} className={styles.sectionCard}>
                <div className={styles.cardTitleRow}>
                  <div className={`${styles.cardTitleIcon} ${styles.iconIndigo}`}>{s.icon}</div>
                  <div>
                    <h2>{s.title}</h2>
                    {s.subtitle ? <p>{s.subtitle}</p> : null}
                  </div>
                </div>
                {s.tables.map((tbl, ti) => (
                  <div key={ti}>
                    {tbl.caption ? <div className={styles.tableSectionHead}>{tbl.caption}</div> : null}
                    <table className={styles.premiumTable}>
                      <thead>
                        <tr>
                          {tbl.headers.map((h, hi) => (
                            <th key={hi}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tbl.rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci}>
                                {cell.includes('₹') && ci === 0 ? <span className={styles.siVal}>{cell}</span> : cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {tbl.note ? <p className={styles.tableNote}>{tbl.note}</p> : null}
                  </div>
                ))}
              </div>
            );

          case 'exclusions':
            return (
              <div key={key} className={styles.sectionCard} id="pa-exclusions">
                <div className={styles.cardTitleRow}>
                  <div className={`${styles.cardTitleIcon} ${styles.iconRed}`}>{s.icon}</div>
                  <div>
                    <h2>{s.title}</h2>
                    {s.subtitle ? <p>{s.subtitle}</p> : null}
                  </div>
                </div>
                <div className={styles.exclGrid}>
                  {s.items.map((ex, j) => (
                    <div key={j} className={styles.exclItem}>
                      <div className={styles.exclIcon}>{ex.icon}</div>
                      <div className={styles.exclText}>
                        <h4>{ex.title}</h4>
                        <p>{ex.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {s.footerHtml ? (
                  <div
                    className={styles.exclNote}
                    dangerouslySetInnerHTML={{ __html: s.footerHtml }}
                  />
                ) : null}
              </div>
            );

          case 'storyExample':
            return (
              <div key={key} className={styles.sectionCard} id="pa-example">
                <div className={styles.cardTitleRow}>
                  <div className={`${styles.cardTitleIcon} ${styles.iconSage}`}>{s.icon}</div>
                  <div>
                    <h2>{s.title}</h2>
                    {s.subtitle ? <p>{s.subtitle}</p> : null}
                  </div>
                </div>
                <div className={styles.storyCard}>
                  <div className={styles.storyProfile}>
                    <div className={styles.storyAvatar}>{s.profile.avatar}</div>
                    <div>
                      <div className={styles.storyName}>{s.profile.name}</div>
                      <div className={styles.storyRole}>{s.profile.role}</div>
                    </div>
                    <div className={styles.storyBadge}>{s.profile.badge}</div>
                  </div>
                  <div className={styles.storyIncident}>
                    <div className={styles.storyIncidentLabel}>{s.incidentLabel}</div>
                    <p className={styles.featureDesc}>{s.incidentText}</p>
                  </div>
                  <div className={styles.storyOutcome}>
                    <div className={styles.storyOutcomeLabel}>{s.outcomeLabel}</div>
                    {s.calcRows.map((r, j) => (
                      <div key={j} className={`${styles.calcRow} ${r.total ? styles.calcTotal : ''}`}>
                        <span>{r.key}</span>
                        <span className={r.total ? styles.teal : undefined}>{r.val}</span>
                      </div>
                    ))}
                    <p className={styles.storyNote}>{s.outcomeNote}</p>
                  </div>
                  <div className={styles.storyPremNote}>{s.premiumNote}</div>
                </div>
              </div>
            );

          case 'productTabs':
            return <ProductTabs key={key} tabs={s.tabs} panels={s.panels} />;

          case 'healthQuoteHero':
            return (
              <div key={key}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${s.progressPercent}%` }} />
                </div>
                <div className={styles.planHero}>
                  <div className={styles.planHeroRow}>
                    <div>
                      <div className={styles.planTag}>
                        <span className={styles.dot} />
                        <span>{s.planTag}</span>
                      </div>
                      <h1 className={styles.heroHeadline}>
                        {s.title}
                        {s.titleEm ? <em> {s.titleEm}</em> : null}
                      </h1>
                      <p className={styles.heroDesc}>{s.description}</p>
                      <div className={styles.heroChips}>
                        {s.chips.map((c, j) => (
                          <span key={j} className={styles.heroChip}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.heroPremBox}>
                      <div className={styles.heroPremLabel}>{s.premLabel}</div>
                      <div className={styles.heroPremAmount}>{s.premAmount}</div>
                      <div className={styles.heroPremSub}>{s.premSub}</div>
                    </div>
                  </div>
                </div>
              </div>
            );

          case 'healthQuoteSteps':
            return (
              <div key={key} className={styles.stepsBar}>
                <div className={styles.stepsInner}>
                  {s.steps.map((st, j) => (
                    <span key={st.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        className={`${styles.stepItemBar} ${st.active ? styles.stepItemBarActive : ''}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <span className={styles.stepNum}>{st.num}</span>
                        <span>{st.label}</span>
                      </span>
                      {j < s.steps.length - 1 ? <span style={{ color: 'var(--pp-muted)' }}>›</span> : null}
                    </span>
                  ))}
                </div>
              </div>
            );

          case 'infoCallout':
            return (
              <div key={key} className={styles.infoCallout}>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
                <div className={styles.infoLinks}>
                  {s.links.map((l, j) => (
                    <MarketingLink key={j} link={l} />
                  ))}
                </div>
              </div>
            );

          case 'stack':
            return (
              <div key={key} className={s.variant === 'layout' ? styles.layout : undefined}>
                <MarketingSections sections={s.sections} />
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
