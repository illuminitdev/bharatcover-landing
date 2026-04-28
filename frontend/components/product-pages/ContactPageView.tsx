import type { ContactPageData } from '@/types/product-page';
import styles from './ContactPage.module.css';
import { ContactQuoteForm } from './ContactQuoteForm';

type Props = {
  data: ContactPageData;
};

export function ContactPageView({ data }: Props) {
  const { hero, form, sidebar } = data;

  return (
    <div className={styles.root}>
      <section className={styles.pageHero} aria-label="Contact hero">
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <div className={styles.heroTag}>{hero.tag}</div>
            <h1>
              {hero.titleLine1}
              <br />
              {hero.titleLine2} <em>{hero.titleEmphasis}</em>
            </h1>
            <p className={styles.heroDesc}>{hero.description}</p>
            <div className={styles.heroChannels}>
              {hero.channels.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  className={styles.heroChannel}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span>{c.icon}</span> {c.label}
                </a>
              ))}
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroVisual}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.visual.src} alt={hero.visual.alt} />
              <div className={styles.heroPriceCard}>
                <div className={styles.hpcLabel}>{hero.priceCard.label}</div>
                <div className={styles.hpcPrice}>{hero.priceCard.value}</div>
                <div className={styles.itemSub} style={{ marginTop: 6 }}>
                  {hero.priceCard.sub}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.pageBody}>
        <ContactQuoteForm form={form} />

        <aside className={styles.sidebar}>
          {sidebar.map((block, i) => {
            if (block.kind === 'infoCard') {
              return (
                <div key={i} className={styles.infoCard}>
                  <div className={styles.infoCardHead}>
                    <h3>{block.title}</h3>
                    <p>{block.subtitle}</p>
                  </div>
                  <div className={styles.infoCardBody}>
                    {block.items.map((it, j) => (
                      <div key={j} className={styles.contactItem}>
                        <div className={`${styles.contactIcon} ${styles[it.iconVariant]}`}>{it.icon}</div>
                        <div>
                          <div className={styles.itemLabel}>{it.label}</div>
                          <div className={styles.itemVal}>
                            {it.href ? (
                              <a href={it.href} {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                                {it.value}
                              </a>
                            ) : (
                              it.value
                            )}
                          </div>
                          {it.sub ? <div className={styles.itemSub}>{it.sub}</div> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (block.kind === 'hours') {
              return (
                <div key={i} className={styles.hoursCard}>
                  <h3>{block.title}</h3>
                  {block.rows.map((r, j) => (
                    <div key={j} className={`${styles.hoursRow} ${r.today ? styles.today : ''}`}>
                      <span className={styles.hoursDay}>{r.day}</span>
                      <span className={styles.hoursTime}>{r.time}</span>
                    </div>
                  ))}
                </div>
              );
            }
            if (block.kind === 'ctaCard') {
              return (
                <div key={i} className={styles.ctaCard}>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>
                  <a href={block.button.href}>{block.button.label}</a>
                </div>
              );
            }
            if (block.kind === 'partners') {
              return (
                <div key={i} className={styles.partnersCard}>
                  <h4>{block.title}</h4>
                  {block.partners.map((p, j) => (
                    <div key={j} className={styles.partnerRow}>
                      <span
                        className={styles.dot}
                        style={{ background: ['#2563EB', '#E63946', '#16A34A'][j] ?? '#999' }}
                      />
                      {p}
                    </div>
                  ))}
                  <div className={styles.partnerFoot}>{block.footnote}</div>
                </div>
              );
            }
            return null;
          })}
        </aside>
      </div>
    </div>
  );
}
