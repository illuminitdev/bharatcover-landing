'use client';

export default function ClientMain({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ marginTop: '80px' }}>
      {children}
    </main>
  );
}
