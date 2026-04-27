'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { USER_SESSION_STORAGE } from '@/lib/guest-api';

export default function SalesLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/sales/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        token?: string;
        latestPolicyId?: string;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.token) {
        setError(data.error ?? data.message ?? 'Login failed');
        return;
      }
      sessionStorage.setItem(USER_SESSION_STORAGE.token, data.token);
      sessionStorage.setItem(USER_SESSION_STORAGE.email, email.trim().toLowerCase());
      if (data.latestPolicyId) {
        router.push(`/sales/policy/${encodeURIComponent(data.latestPolicyId)}/view`);
      } else {
        router.push('/sales/my-policies');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 26 }}>Policy Login</h1>
      <p style={{ margin: '0 0 16px', color: '#6b7280' }}>Login using credentials sent after payment.</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
        <button type="submit" disabled={busy} style={{ height: 42, borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700 }}>
          {busy ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

