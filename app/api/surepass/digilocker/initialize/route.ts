import { NextResponse } from 'next/server';
import {
  extractDigilockerClientId,
  extractDigilockerLink,
  getSurepassApiBase,
  getSurepassApiKey,
  getSurepassInitPath,
  isAllowedDigilockerRedirectUrl,
} from '@/lib/surepass-digilocker-proxy';

export async function POST(req: Request) {
  const apiKey = getSurepassApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'SurePass is not configured (missing SUREPASS_API_KEY on the server).' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Expected JSON object' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const redirectUrl = b.redirect_url;
  if (typeof redirectUrl !== 'string' || !redirectUrl.trim()) {
    return NextResponse.json({ error: 'redirect_url is required' }, { status: 400 });
  }
  if (!isAllowedDigilockerRedirectUrl(redirectUrl)) {
    return NextResponse.json(
      {
        error:
          'redirect_url origin is not allowed. Set NEXT_PUBLIC_SITE_URL (or NEXT_PUBLIC_APP_URL) to your site origin, or use localhost in development.',
      },
      { status: 400 }
    );
  }

  const forward: Record<string, unknown> = { redirect_url: redirectUrl.trim() };
  if (typeof b.signup_flow === 'string') forward.signup_flow = b.signup_flow;
  if (typeof b.expiry_minutes === 'number' && Number.isFinite(b.expiry_minutes)) {
    forward.expiry_minutes = b.expiry_minutes;
  }

  const base = getSurepassApiBase();
  const path = getSurepassInitPath();
  const spRes = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(forward),
  });

  const text = await spRes.text();
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: 'SurePass returned non-JSON', status: spRes.status, bodyPreview: text.slice(0, 200) },
      { status: 502 }
    );
  }

  const spFailed = !spRes.ok || json.success === false;
  if (spFailed) {
    const status =
      !spRes.ok && spRes.status >= 400 && spRes.status < 600
        ? spRes.status
        : json.success === false && typeof json.status_code === 'number'
          ? json.status_code
          : 502;
    return NextResponse.json(
      {
        error: typeof json.message === 'string' ? json.message : 'SurePass request failed',
        surepass: json,
      },
      { status: status >= 400 && status < 600 ? status : 502 }
    );
  }

  const link = extractDigilockerLink(json);
  const clientId = extractDigilockerClientId(json);

  return NextResponse.json({
    ok: true,
    link,
    client_id: clientId,
    surepass: json,
  });
}
