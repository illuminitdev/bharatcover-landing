'use client';

import { usePathname } from 'next/navigation';
import { hideGlobalSiteChrome } from '@/lib/sales-funnel-paths';

export default function ClientMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckoutFlow = hideGlobalSiteChrome(pathname);

  return (
    <main style={{ marginTop: isCheckoutFlow ? '0' : '80px' }}>
      {children}
    </main>
  );
}
