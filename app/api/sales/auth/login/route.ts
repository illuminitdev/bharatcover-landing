import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!base) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_API_URL is not configured' }, { status: 503 });
  }
  let bodyText = '{}';
  try {
    bodyText = await request.text();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: bodyText || '{}',
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

