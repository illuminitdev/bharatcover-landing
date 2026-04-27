import { NextRequest, NextResponse } from 'next/server';
import {
  getExpectedAmountPaiseForProduct,
  getRazorpayKeyIdForServer,
  getRazorpayKeySecretForServer,
  isServerDirectCheckoutRazorpayAllowed,
} from '@/lib/razorpay-direct-checkout';

type CheckoutOrderBody = {
  productId?: string;
};

export async function POST(request: NextRequest) {
  try {
    if (!isServerDirectCheckoutRazorpayAllowed()) {
      return NextResponse.json(
        { error: 'Direct checkout is disabled on this server.' },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as CheckoutOrderBody;
    const productId = (body.productId ?? '').trim();
    const amount = getExpectedAmountPaiseForProduct(productId);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid product for checkout.' }, { status: 400 });
    }

    const key = getRazorpayKeyIdForServer();
    const secret = getRazorpayKeySecretForServer();
    if (!key || !secret) {
      return NextResponse.json(
        { error: 'Razorpay keys are missing on server environment.' },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const rpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `bc_${productId}_${Date.now()}`,
        notes: { productId, source: 'frontend_direct_checkout' },
      }),
    });

    const rpJson = (await rpRes.json().catch(() => ({}))) as {
      id?: string;
      amount?: number;
      currency?: string;
      error?: { description?: string };
    };
    if (!rpRes.ok || !rpJson.id) {
      return NextResponse.json(
        { error: rpJson?.error?.description ?? 'Failed to create Razorpay order.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      keyId: key,
      key,
      orderId: rpJson.id,
      amount: rpJson.amount ?? amount,
      currency: rpJson.currency ?? 'INR',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected error while creating order.',
      },
      { status: 500 }
    );
  }
}

