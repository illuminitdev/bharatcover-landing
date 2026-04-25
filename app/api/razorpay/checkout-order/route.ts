import { createHash, randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import {
  getExpectedAmountPaiseForProduct,
  getRazorpayKeyIdForServer,
  getRazorpayKeySecretForServer,
  isServerDirectCheckoutRazorpayAllowed,
} from '@/lib/razorpay-direct-checkout';

export async function POST(req: Request) {
  if (!isServerDirectCheckoutRazorpayAllowed()) {
    return NextResponse.json({ error: 'Direct Razorpay checkout is disabled in this environment.' }, { status: 403 });
  }

  const keyId = getRazorpayKeyIdForServer();
  const keySecret = getRazorpayKeySecretForServer();
  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        error:
          'Razorpay “Key id” (NEXT_PUBLIC_RAZORPAY_KEY_ID) is for the browser only. The server also needs the matching API Key *secret* in RAZORPAY_KEY_SECRET (Razorpay Dashboard → Test mode → Settings → API Keys → Reveal).',
        missingKeyId: !keyId,
        missingKeySecret: !keySecret,
        helpUrl: 'https://razorpay.com/docs/payments/payments/standard-checkout/',
      },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Expected JSON object' }, { status: 400 });
  }

  const { productId } = body as { productId?: string };
  if (typeof productId !== 'string') {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const amountPaise = getExpectedAmountPaiseForProduct(productId);
  if (amountPaise == null) {
    return NextResponse.json({ error: 'Unknown productId for direct checkout' }, { status: 400 });
  }

  const receipt = `landing_${productId}_${createHash('sha256').update(randomBytes(8)).digest('hex').slice(0, 16)}`;
  const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const rzRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes: { source: 'bharatcover_landing_direct', productId },
    }),
  });

  const rzJson = (await rzRes.json()) as {
    id?: string;
    amount?: number;
    currency?: string;
    error?: { description?: string };
  };

  if (!rzRes.ok || !rzJson.id) {
    return NextResponse.json(
      {
        error: rzJson.error?.description ?? 'Razorpay order creation failed',
        details: rzJson,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    orderId: rzJson.id,
    amount: rzJson.amount ?? amountPaise,
    currency: rzJson.currency ?? 'INR',
    keyId,
  });
}
