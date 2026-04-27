'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import { hideGlobalSiteChrome } from '@/lib/sales-funnel-paths';
import { PRODUCT_PAGE_LINKS } from '@/lib/product-pages';
import styles from './Header.module.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isCheckoutFlow = hideGlobalSiteChrome(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setProductsOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!productsOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(e.target as Node)
      ) {
        setProductsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProductsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [productsOpen]);

  const closeMenus = () => {
    setProductsOpen(false);
    setIsMobileMenuOpen(false);
  };

  if (isCheckoutFlow) return null;

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

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={closeMenus}>
            Home
          </Link>
          <Link href="/about" className={styles.navLink} onClick={closeMenus}>
            About
          </Link>
          <div className={styles.productsDropdown} ref={productsDropdownRef}>
            <button
              type="button"
              className={styles.productsTrigger}
              aria-expanded={productsOpen}
              aria-haspopup="menu"
              aria-controls="products-submenu"
              id="products-menu-button"
              onClick={() => setProductsOpen((o) => !o)}
            >
              Products
              <FaChevronDown
                className={`${styles.chevron} ${productsOpen ? styles.chevronOpen : ''}`}
                aria-hidden
                size={12}
              />
            </button>
            {productsOpen ? (
              <ul
                className={styles.dropdownPanel}
                id="products-submenu"
                role="menu"
                aria-labelledby="products-menu-button"
              >
                {PRODUCT_PAGE_LINKS.map(({ file, label }) => (
                  <li key={file} role="none">
                    <Link
                      role="menuitem"
                      href={`/product_pages/${file}`}
                      className={styles.dropdownLink}
                      onClick={closeMenus}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <Link href="/sales" className={styles.navLink} onClick={closeMenus}>
            Sales
          </Link>
          <Link href="/why-choose-us" className={styles.navLink} onClick={closeMenus}>
            Why Choose Us
          </Link>
          <Link href="/claims" className={styles.navLink} onClick={closeMenus}>
            Claims
          </Link>
          <Link href="/contact" className={styles.ctaButton} onClick={closeMenus}>
            Get Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
