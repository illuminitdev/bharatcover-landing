import { NextResponse } from 'next/server';
import { verifyRazorpayPaymentSignature } from '@/lib/payments/verify-razorpay-signature';
import {
  getRazorpayKeySecretForServer,
  isServerDirectCheckoutRazorpayAllowed,
} from '@/lib/razorpay-direct-checkout';

export async function POST(req: Request) {
  if (!isServerDirectCheckoutRazorpayAllowed()) {
    return NextResponse.json({ error: 'Direct Razorpay checkout is disabled in this environment.' }, { status: 403 });
  }

  const keySecret = getRazorpayKeySecretForServer();
  if (!keySecret) {
    return NextResponse.json(
      { error: 'RAZORPAY_KEY_SECRET is not set in .env (required to verify the payment signature).' },
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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  if (
    typeof razorpay_order_id !== 'string' ||
    typeof razorpay_payment_id !== 'string' ||
    typeof razorpay_signature !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
  }

  if (!verifyRazorpayPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, keySecret)) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
  }

  /** Direct path has no policy row; guest path uses the landing API verify. */
  return NextResponse.json({ verified: true, source: 'direct' });
}
