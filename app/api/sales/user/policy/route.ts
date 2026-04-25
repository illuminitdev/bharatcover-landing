import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!base) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_API_URL is not configured' }, { status: 503 });
  }
  const auth = request.headers.get('authorization')?.trim();
  if (!auth?.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'Missing Authorization Bearer token' }, { status: 401 });
  }
  const url = new URL(request.url);
  const policyId = url.searchParams.get('policyId')?.trim();
  if (!policyId) {
    return NextResponse.json({ error: 'policyId query param is required' }, { status: 400 });
  }
  const res = await fetch(`${base}/user/policies/${encodeURIComponent(policyId)}`, {
    headers: { Authorization: auth },
    cache: 'no-store',
  });
  const text = await res.text();
  let payload: unknown = {};
  try {
    payload = text ? (JSON.parse(text) as unknown) : {};
  } catch {
    payload = { error: 'Upstream non-JSON response', raw: text.slice(0, 500) };
  }
  return NextResponse.json(payload, { status: res.status });
}

