'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { USER_SESSION_STORAGE } from '@/lib/guest-api';

type Policy = {
  policyId?: string;
  certificateNumber?: string;
  status?: string;
  updatedAt?: number;
};

export default function MyPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem(USER_SESSION_STORAGE.token);
    if (!token) {
      setError('Please login first');
      return;
    }
    (async () => {
      const res = await fetch('/api/sales/user/policies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json().catch(() => ({}))) as { policies?: Policy[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Could not load policies');
        return;
      }
      setPolicies(data.policies ?? []);
    })().catch(() => setError('Could not load policies'));
  }, []);

  return (
    <div style={{ maxWidth: 860, margin: '32px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>My Policies</h1>
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      <div style={{ display: 'grid', gap: 12 }}>
        {policies.map((p) => (
          <div key={p.policyId} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, background: '#fff' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{p.certificateNumber || p.policyId}</p>
            <p style={{ margin: '4px 0 10px', color: '#6b7280' }}>{p.status || '—'}</p>
            <Link href={`/sales/policy/${encodeURIComponent(p.policyId || '')}/view`} style={{ color: '#2563eb', fontWeight: 700 }}>
              View policy
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

