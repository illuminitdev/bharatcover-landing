import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Server-side check for Razorpay client callback / verify payloads.
 * Same algorithm as the landing guest `payments/verify` Lambda: HMAC-SHA256 of `orderId|paymentId` with the API key secret.
 */
export function verifyRazorpayPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  keySecret: string
): boolean {
  const expected = createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(razorpaySignature, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
