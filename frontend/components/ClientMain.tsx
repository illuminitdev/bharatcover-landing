'use client';

import { usePathname } from 'next/navigation';

export default function ClientMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckoutFlow = pathname.startsWith('/sales/products') || 
                         pathname.startsWith('/sales/contact') || 
                         pathname.startsWith('/sales/checkout');
  const isEmbeddedStaticFlow = pathname.startsWith('/personal') || pathname.startsWith('/business');

  return (
    <main style={{ marginTop: isCheckoutFlow || isEmbeddedStaticFlow ? '0' : '80px' }}>
      {children}
    </main>
  );
}
