import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayKeySecretForServer } from '@/lib/razorpay-direct-checkout';

type CheckoutVerifyBody = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as CheckoutVerifyBody;
    const orderId = (body.razorpay_order_id ?? '').trim();
    const paymentId = (body.razorpay_payment_id ?? '').trim();
    const signature = (body.razorpay_signature ?? '').trim();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing Razorpay verification fields.' },
        { status: 400 }
      );
    }

    const secret = getRazorpayKeySecretForServer();
    if (!secret) {
      return NextResponse.json(
        { error: 'Razorpay key secret is missing on server environment.' },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Razorpay signature verification failed.' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      status: 'verified',
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected error while verifying payment.',
      },
      { status: 500 }
    );
  }
}

