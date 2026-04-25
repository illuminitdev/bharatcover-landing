import { NextResponse } from 'next/server';

/**
 * Server-side proxy for `POST /guest/payments/verify`.
 * Browser calls this same-origin URL so dev ports (e.g. :4000) never hit API Gateway CORS.
 */
export async function POST(request: Request) {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!base) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_API_URL is not configured' }, { status: 503 });
  }
  const auth = request.headers.get('authorization')?.trim();
  if (!auth?.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Authorization Bearer token' }, { status: 401 });
  }

  let bodyText: string;
  try {
    bodyText = await request.text();
  } catch (e) {
    return NextResponse.json(
      { error: 'Could not read request body', message: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }

  let res: Response;
  try {
    res = await fetch(`${base}/guest/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: bodyText || '{}',
      cache: 'no-store',
    });
  } catch (e) {
    console.error('[guest/payments/verify proxy] fetch failed', e);
    return NextResponse.json(
      {
        error: 'Could not reach guest API',
        message: e instanceof Error ? e.message : String(e),
        hint: `Check NEXT_PUBLIC_API_URL (${base.slice(0, 48)}…) and network.`,
      },
      { status: 502 }
    );
  }

  const text = await res.text();
  let data: unknown = {};
  try {
    data = text ? (JSON.parse(text) as unknown) : {};
  } catch {
    data = { error: 'Upstream returned non-JSON', raw: text.slice(0, 500) };
  }
  return NextResponse.json(data, { status: res.status });
}
