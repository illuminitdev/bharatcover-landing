import { NextResponse } from 'next/server';
import {
  digilockerStatusLooksSuccessful,
  getSurepassApiBase,
  getSurepassApiKey,
  getSurepassStatusPath,
} from '@/lib/surepass-digilocker-proxy';

export async function GET(req: Request) {
  const apiKey = getSurepassApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'SurePass is not configured (missing SUREPASS_API_KEY on the server).' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id')?.trim();
  if (!clientId) {
    return NextResponse.json({ error: 'client_id query parameter is required' }, { status: 400 });
  }

  const base = getSurepassApiBase();
  const path = getSurepassStatusPath();
  const url = new URL(path, base);
  url.searchParams.set('client_id', clientId);

  const spRes = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
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

  const verified = digilockerStatusLooksSuccessful(json);

  return NextResponse.json({
    ok: spRes.ok,
    verified,
    surepass: json,
  });
}
