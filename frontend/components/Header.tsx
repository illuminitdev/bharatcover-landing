'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const PERSONAL_LINKS = [
  { label: 'Personal Overview', href: '/personal' },
  { label: 'Accident Cover', href: '/personal/accident' },
  { label: 'Health Insurance', href: '/personal/health-insurance' },
  { label: 'Health Quote', href: '/personal/health-quote' },
  { label: 'Contact', href: '/personal/contact' },
];

const BUSINESS_LINKS = [
  { label: 'Business Overview', href: '/business' },
  { label: 'Contact', href: '/business/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'personal' | 'business' | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const isCheckoutFlow = pathname.startsWith('/sales/products') || 
                         pathname.startsWith('/sales/contact') || 
                         pathname.startsWith('/sales/checkout');
  const isEmbeddedStaticFlow = pathname.startsWith('/personal') || pathname.startsWith('/business');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [openMenu]);

  const closeMenus = () => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  if (isCheckoutFlow || isEmbeddedStaticFlow) return null;

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.png"
            alt="VS Insurance Logo"
            width={180}
            height={60}
            priority
            className={styles.logoImage}
          />
        </Link>

        <button
          className={styles.mobileToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileOpen : ''}`} ref={navRef}>
          <Link href="/" className={styles.navLink} onClick={closeMenus}>Home</Link>
          <Link href="/about" className={styles.navLink} onClick={closeMenus}>About</Link>

          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownTrigger}
              onClick={() => setOpenMenu((current) => (current === 'business' ? null : 'business'))}
              aria-expanded={openMenu === 'business'}
              aria-haspopup="menu"
            >
              Business
            </button>
            {openMenu === 'business' ? (
              <ul className={styles.dropdownPanel} role="menu">
                {BUSINESS_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.dropdownLink} onClick={closeMenus}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownTrigger}
              onClick={() => setOpenMenu((current) => (current === 'personal' ? null : 'personal'))}
              aria-expanded={openMenu === 'personal'}
              aria-haspopup="menu"
            >
              Personal
            </button>
            {openMenu === 'personal' ? (
              <ul className={styles.dropdownPanel} role="menu">
                {PERSONAL_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.dropdownLink} onClick={closeMenus}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <Link href="/why-choose-us" className={styles.navLink} onClick={closeMenus}>Why Choose Us</Link>
          <Link href="/claims" className={styles.navLink} onClick={closeMenus}>Claims</Link>
          <Link href="/personal/contact" className={styles.ctaButton} onClick={closeMenus}>Get Quote</Link>
        </nav>
      </div>
    </header>
  );
}
