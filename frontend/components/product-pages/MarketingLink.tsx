import Link from 'next/link';
import type { ProductLink } from '@/types/product-page';
import styles from './ProductMarketing.module.css';

const variantClass: Record<NonNullable<ProductLink['variant']>, string> = {
  teal: styles.btnTeal,
  'outline-white': styles.btnOutlineWhite,
  'outline-navy': styles.btnOutlineNavy,
  'hero-primary': styles.btnHeroPrimary,
  'hero-outline': styles.btnHeroOutline,
  'sm-outline': `${styles.btnOutlineNavy} ${styles.btnSm}`,
};

export function MarketingLink({ link, className }: { link: ProductLink; className?: string }) {
  const v = link.variant ?? 'teal';
  const cls = [styles.btn, variantClass[v] ?? styles.btnTeal, className].filter(Boolean).join(' ');
  const isExternal =
    link.external ||
    link.href.startsWith('http') ||
    link.href.startsWith('mailto:') ||
    link.href.startsWith('tel:');

  if (isExternal) {
    return (
      <a
        href={link.href}
        className={cls}
        {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={cls}>
      {link.label}
    </Link>
  );
}
