import { NextRequest, NextResponse } from 'next/server';
import { getInsuranceApiBase } from '@/lib/insurance-api-config';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const base = getInsuranceApiBase('customerSales');
  if (!base) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_CUSTOMER_SALES_API_URL is not configured.' },
      { status: 500 }
    );
  }

  const upstream = await fetch(`${base}/sales/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const text = await upstream.text();
  return new NextResponse(text || '{}', {
    status: upstream.status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

