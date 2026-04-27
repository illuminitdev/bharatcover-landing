import { readFile } from 'fs/promises';
import path from 'path';
import StaticHtmlClient from './StaticHtmlClient';

type StaticHtmlPageProps = {
  file: 'personal' | 'business' | 'health-insurance' | 'health-quote' | 'bharatcover_product_page_v2' | 'contact';
  title: string;
};

const UNIFIED_FOOTER_STYLE = `
<style id="bc-unified-footer-style">
  .bc-unified-footer {
    background: #07164a;
    color: #ffffff;
    padding: 56px 0 22px;
    margin-top: 0;
  }

  .bc-unified-footer * {
    box-sizing: border-box;
  }

  .bc-unified-footer-inner {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .bc-unified-footer-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr;
    gap: 24px;
    margin-bottom: 26px;
  }

  .bc-unified-footer-title {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #ffffff;
  }

  .bc-unified-footer-heading {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #ffffff;
  }

  .bc-unified-footer-desc {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.75);
    max-width: 330px;
  }

  .bc-unified-footer-links {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bc-unified-footer-links a {
    color: rgba(255, 255, 255, 0.86);
    text-decoration: none;
    font-size: 13px;
    line-height: 1.45;
    transition: color 0.2s ease;
  }

  .bc-social-link {
    display: inline-flex !important;
    align-items: center;
    gap: 8px;
  }

  .bc-social-links {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, max-content)) !important;
    column-gap: 18px !important;
    row-gap: 10px !important;
  }

  .bc-social-links li {
    margin: 0 !important;
  }

  .bc-social-icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 800;
    line-height: 1;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.35);
  }

  .bc-unified-footer-links a:hover {
    color: #0ab5a8;
  }

  .bc-unified-footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.13);
    padding-top: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .bc-unified-footer-bottom-text {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.6);
  }

  .bc-unified-footer-bottom-links {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }

  .bc-unified-footer-bottom-links a {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.72);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .bc-unified-footer-bottom-links a:hover {
    color: #ffffff;
  }

  @media (max-width: 900px) {
    .bc-unified-footer-grid {
      grid-template-columns: 1fr 1fr;
      gap: 22px;
    }
  }

  @media (max-width: 640px) {
    .bc-unified-footer {
      padding: 40px 0 18px;
    }

    .bc-unified-footer-grid {
      grid-template-columns: 1fr;
      gap: 18px;
    }

    .bc-unified-footer-bottom {
      align-items: flex-start;
    }

    .bc-social-links {
      grid-template-columns: 1fr !important;
    }
  }
</style>
`;

const UNIFIED_HERO_STYLE = `
<style id="bc-unified-hero-style">
  .hero,
  .page-hero,
  .plan-hero,
  .prod-hero {
    position: relative !important;
    overflow: hidden !important;
    background: linear-gradient(135deg, #1b3c78 0%, #0d2454 100%) !important;
  }

  .hero::before,
  .page-hero::before,
  .plan-hero::before,
  .prod-hero::before {
    content: "" !important;
    position: absolute !important;
    inset: 0 !important;
    background-image:
      radial-gradient(circle, rgba(255, 255, 255, 0.16) 1.2px, transparent 1.2px),
      radial-gradient(circle, rgba(255, 255, 255, 0.08) 0.9px, transparent 0.9px) !important;
    background-size: 36px 36px, 18px 18px !important;
    background-position: 0 0, 9px 9px !important;
    border: none !important;
    border-radius: 0 !important;
    width: auto !important;
    height: auto !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    pointer-events: none !important;
    z-index: 0 !important;
  }

  .hero::after,
  .page-hero::after,
  .plan-hero::after,
  .prod-hero::after {
    content: "" !important;
    position: absolute !important;
    top: -120px !important;
    right: -120px !important;
    width: 620px !important;
    height: 620px !important;
    border-radius: 50% !important;
    background: radial-gradient(circle, rgba(10, 181, 168, 0.09) 0%, transparent 70%) !important;
    border: none !important;
    pointer-events: none !important;
    z-index: 0 !important;
  }

  .hero > *,
  .page-hero > *,
  .plan-hero > *,
  .prod-hero > * {
    position: relative !important;
    z-index: 1 !important;
  }
  .hero-gradient,
  .hero-dots,
  .hero-pixel-grid,
  .hero-ring-3,
  .hero-ring-4 {
    display: none !important;
  }
</style>
`;

const UNIFIED_FOOTER_MARKUP = `
<footer class="bc-unified-footer">
  <div class="bc-unified-footer-inner">
    <div class="bc-unified-footer-grid">
      <div>
        <h4 class="bc-unified-footer-title">BHARATCOVER</h4>
        <p class="bc-unified-footer-desc">IRDAI-regulated insurance distribution platform. Policies underwritten by Magma General, SBI General and Go Digit General Insurance.</p>
      </div>
      <div>
        <h4 class="bc-unified-footer-heading">PERSONAL PLANS</h4>
        <ul class="bc-unified-footer-links">
          <li><a href="/personal/health-insurance">Bharat Arogya Individual</a></li>
          <li><a href="/personal/health-insurance">Bharat Arogya Family Floater</a></li>
          <li><a href="/personal/accident">Bharat Suraksha Accident</a></li>
          <li><a href="/personal/accident">Bharat Suraksha Daily Cash</a></li>
        </ul>
      </div>
      <div>
        <h4 class="bc-unified-footer-heading">BUSINESS PLANS</h4>
        <ul class="bc-unified-footer-links">
          <li><a href="/business">Group Health Insurance</a></li>
          <li><a href="/business">Group Personal Accident</a></li>
          <li><a href="/business">School &amp; College PA</a></li>
          <li><a href="/business">Workmen Compensation</a></li>
        </ul>
      </div>
      <div>
        <h4 class="bc-unified-footer-heading">SUPPORT</h4>
        <ul class="bc-unified-footer-links">
          <li><a href="/business/contact">Get a Quote</a></li>
          <li><a href="/claims">Claims Support</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/business/contact">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4 class="bc-unified-footer-heading">FOLLOW US</h4>
        <ul class="bc-unified-footer-links bc-social-links">
          <li><a class="bc-social-link" href="https://www.facebook.com/profile.php?id=61563633155912" target="_blank" rel="noopener noreferrer"><span class="bc-social-icon">f</span> Facebook</a></li>
          <li><a class="bc-social-link" href="https://www.instagram.com/bharatcover_official/" target="_blank" rel="noopener noreferrer"><span class="bc-social-icon">ig</span> Instagram</a></li>
          <li><a class="bc-social-link" href="https://www.linkedin.com/company/bharatcover/" target="_blank" rel="noopener noreferrer"><span class="bc-social-icon">in</span> LinkedIn</a></li>
          <li><a class="bc-social-link" href="https://www.youtube.com/@bharatcover_official" target="_blank" rel="noopener noreferrer"><span class="bc-social-icon">yt</span> YouTube</a></li>
        </ul>
      </div>
    </div>
    <div class="bc-unified-footer-bottom">
      <p class="bc-unified-footer-bottom-text">© 2024 BharatCover Insurance Brokers Pvt. Ltd. IRDAI Registration No. XXXXXX. All rights reserved.</p>
      <div class="bc-unified-footer-bottom-links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Use</a>
        <a href="#">Cookie Policy</a>
        <a href="#">Disclaimer</a>
      </div>
    </div>
  </div>
</footer>
`;

function extractBlocks(html: string, pattern: RegExp): string {
  const matches = html.match(pattern);
  return matches ? matches.join('\n') : '';
}

function withUnifiedFooter(rawHtml: string): string {
  const footerPattern = /<footer\b[\s\S]*?<\/footer>/i;

  if (footerPattern.test(rawHtml)) {
    return `${UNIFIED_FOOTER_STYLE}\n${rawHtml.replace(footerPattern, UNIFIED_FOOTER_MARKUP)}`;
  }

  const bodyClosePattern = /<\/body>/i;
  if (bodyClosePattern.test(rawHtml)) {
    return `${UNIFIED_FOOTER_STYLE}\n${rawHtml.replace(bodyClosePattern, `${UNIFIED_FOOTER_MARKUP}\n</body>`)}`;
  }

  return `${UNIFIED_FOOTER_STYLE}\n${rawHtml}\n${UNIFIED_FOOTER_MARKUP}`;
}

function withUnifiedHero(rawHtml: string): string {
  const headClosePattern = /<\/head>/i;
  if (headClosePattern.test(rawHtml)) {
    return rawHtml.replace(headClosePattern, `${UNIFIED_HERO_STYLE}\n</head>`);
  }

  return `${rawHtml}\n${UNIFIED_HERO_STYLE}`;
}

export async function StaticHtmlPage({ file, title }: StaticHtmlPageProps) {
  const htmlPath = path.join(process.cwd(), '.html', `${file}.html`);
  const rawHtml = await readFile(htmlPath, 'utf-8');
  const htmlWithUnifiedHero = withUnifiedHero(rawHtml);
  const htmlWithUnifiedFooter = withUnifiedFooter(htmlWithUnifiedHero);

  const headStyles = extractBlocks(htmlWithUnifiedFooter, /<style\b[\s\S]*?<\/style>/gi);
  const bodyMatch = htmlWithUnifiedFooter.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlWithUnifiedFooter;
  const html = `${headStyles}\n${bodyContent}`;

  return (
    <main style={{ width: '100%', minHeight: '100vh' }} aria-label={title}>
      <StaticHtmlClient html={html} />
    </main>
  );
}
