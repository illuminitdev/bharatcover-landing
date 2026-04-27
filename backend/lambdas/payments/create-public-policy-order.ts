import crypto from 'crypto';

export function buildPublicPolicyOrder(input: { amount: number; currency: string; receipt: string }) {
  // Placeholder for Razorpay API call; designed to be replaced by SDK integration.
  return {
    orderId: `order_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`,
    amount: input.amount,
    currency: input.currency,
    receipt: input.receipt,
  };
}
