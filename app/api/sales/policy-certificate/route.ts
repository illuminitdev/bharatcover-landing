import { NextResponse } from 'next/server';
import { buildPolicyCertificatePdfBytes } from '@/lib/policies/policy-certificate-pdf';

/**
 * Server-side proxy: loads policy via the landing guest API (HMAC session token),
 * then returns a small PDF for download/print. Keeps the same auth model as
 * `GET /guest/policies/:policyId` (Bearer guest token).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const policyId = url.searchParams.get('policyId')?.trim();
  const auth = request.headers.get('authorization')?.trim();
  if (!policyId) {
    return NextResponse.json({ error: 'Missing policyId query parameter' }, { status: 400 });
  }
  if (!auth?.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Authorization Bearer token' }, { status: 401 });
  }
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!base) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_API_URL is not configured' },
      { status: 503 }
    );
  }
  const token = auth.slice(7).trim();
  let res = await fetch(`${base}/guest/policies/${encodeURIComponent(policyId)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  let data = (await res.json().catch(() => ({}))) as {
    error?: string;
    policy?: Record<string, unknown>;
  };
  if (!res.ok && (res.status === 401 || res.status === 403)) {
    res = await fetch(`${base}/user/policies/${encodeURIComponent(policyId)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    data = (await res.json().catch(() => ({}))) as {
      error?: string;
      policy?: Record<string, unknown>;
    };
  }
  if (!res.ok) {
    return NextResponse.json(
      { error: data.error ?? 'Could not load policy' },
      { status: res.status === 404 ? 404 : 502 }
    );
  }
  if (!data.policy) {
    return NextResponse.json({ error: 'Invalid policy response' }, { status: 502 });
  }
  const safeName =
    (data.policy.certificateNumber as string | undefined) ||
    policyId.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 64);
  const bytes = await buildPolicyCertificatePdfBytes(data.policy);
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bharatcover-policy-${safeName}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
