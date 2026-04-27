import { NextRequest, NextResponse } from 'next/server';
import { getInsuranceApiBase } from '@/lib/insurance-api-config';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')?.trim();
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  const paymentBase = getInsuranceApiBase('payment');
  if (!paymentBase) {
    return NextResponse.json(
      { error: 'Payment API base is not configured (NEXT_PUBLIC_PAYMENT_API_URL).' },
      { status: 500 }
    );
  }

  const bodyText = await request.text();
  const upstream = await fetch(`${paymentBase}/guest/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: bodyText,
  });

  const text = await upstream.text();
  return new NextResponse(text || '{}', {
    status: upstream.status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

