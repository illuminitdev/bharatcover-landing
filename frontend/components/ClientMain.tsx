'use client';

import { usePathname } from 'next/navigation';

export default function ClientMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckoutFlow = pathname.startsWith('/sales/products') || 
                         pathname.startsWith('/sales/contact') || 
                         pathname.startsWith('/sales/checkout');

  return (
    <main style={{ marginTop: isCheckoutFlow ? '0' : '80px' }}>
      {children}
    </main>
  );
}
