import crypto from 'crypto';
import { appConfig } from '../../shared/config';

export function verifyPublicPolicyPaymentSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const body = `${input.orderId}|${input.paymentId}`;
  const generated = crypto
    .createHmac('sha256', appConfig.razorpay.keySecret || 'local-secret')
    .update(body)
    .digest('hex');
  return generated === input.signature;
}
