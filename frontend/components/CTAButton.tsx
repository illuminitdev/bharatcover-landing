import Link from 'next/link';
import styles from './CTAButton.module.css';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'white' | 'whiteOutline';
  size?: 'small' | 'medium' | 'large';
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  size = 'medium'
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
    >
      {children}
    </Link>
  );
}
