'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft, FaCheck, FaDownload, FaFileAlt } from 'react-icons/fa';
import { GUEST_SESSION_STORAGE, USER_SESSION_STORAGE } from '@/lib/guest-api';
import { policyService } from '@/lib/services/policies';
import styles from './view.module.css';

type Policy = {
  policyId?: string;
  productId?: string;
  status?: string;
  certificateNumber?: string;
  fullName?: string;
  termStart?: number;
  termEnd?: number;
  paymentCompletedAt?: number;
  [k: string]: unknown;
};

function formatDate(unix: number | undefined) {
  if (unix == null) return '—';
  const ms = unix < 1e12 ? unix * 1000 : unix;
  return new Date(ms).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function PolicyViewPage() {
  const params = useParams();
  const router = useRouter();
  const policyIdParam = (params?.policyId as string) || '';
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setGuestToken(sessionStorage.getItem(GUEST_SESSION_STORAGE.token));
    setUserToken(sessionStorage.getItem(USER_SESSION_STORAGE.token));
  }, []);

  const load = useCallback(async () => {
    if (!guestToken && !userToken) {
      setError('No active session. Login from /sales/login or complete checkout first.');
      setLoading(false);
      return;
    }
    if (!policyIdParam) {
      setError('Missing policy id');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = guestToken
        ? await policyService.byIdForGuest(policyIdParam, guestToken)
        : await policyService.byIdForSalesUser(policyIdParam, userToken ?? '');
      const data = (await res.json().catch(() => ({}))) as { policy?: Policy; error?: string };
      if (!res.ok) {
        setError(data.error ?? `Failed to load policy (${res.status})`);
        setPolicy(null);
        return;
      }
      if (!data.policy) {
        setError('No policy in response');
        return;
      }
      setPolicy(data.policy);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }, [policyIdParam, guestToken, userToken]);

  useEffect(() => {
    if (guestToken || userToken) void load();
  }, [guestToken, userToken, load]);

  const downloadPdf = async () => {
    const token = guestToken ?? userToken;
    if (!token) return;
    const res = await fetch(
      `/api/sales/policy-certificate?policyId=${encodeURIComponent(policyIdParam)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
      setError('Could not generate PDF');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bharatcover-policy-${policy?.certificateNumber || policyIdParam}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.shell}>
      <div className={styles.inner}>
        <button type="button" className={styles.back} onClick={() => router.push('/sales')}>
          <FaArrowLeft aria-hidden style={{ fontSize: 12 }} />
          Back to products
        </button>

        <header className={styles.header}>
          <div className={styles.iconWrap} aria-hidden>
            <FaFileAlt />
          </div>
          <h1 className={styles.title}>Policy details</h1>
          <p className={styles.sub}>
            {policyIdParam ? `Reference: ${policyIdParam}` : '—'}
          </p>
        </header>

        {loading ? (
          <p className={styles.muted}>Loading…</p>
        ) : error ? (
          <div className={styles.card}>
            <p className={styles.error}>{error}</p>
            <Link href="/sales" className={styles.btnPrimary}>
              Browse products
            </Link>
          </div>
        ) : policy ? (
          <div className={styles.card}>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>
                {policy.status === 'ISSUED' || policy.status === 'PAID' ? (
                  <>
                    <FaCheck style={{ fontSize: 12 }} />
                    {policy.status}
                  </>
                ) : (
                  policy.status ?? '—'
                )}
              </span>
            </div>
            <dl className={styles.dl}>
              <div>
                <dt>Certificate</dt>
                <dd>{policy.certificateNumber ?? '—'}</dd>
              </div>
              <div>
                <dt>Product</dt>
                <dd>{String(policy.productId ?? '—')}</dd>
              </div>
              <div>
                <dt>Proposer</dt>
                <dd>{String(policy.fullName?.trim() || '—')}</dd>
              </div>
              <div>
                <dt>Policy period</dt>
                <dd>
                  {formatDate(policy.termStart as number | undefined)} —{' '}
                  {formatDate(policy.termEnd as number | undefined)}
                </dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <button type="button" className={styles.btnPrimary} onClick={() => void downloadPdf()}>
                <FaDownload aria-hidden style={{ fontSize: 14 }} />
                Download policy PDF
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
