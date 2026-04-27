import { api } from '@/lib/api';
import { guestFetch } from '@/lib/guest-api';

export const paymentService = {
  createPolicyOrder(payload: Record<string, unknown>) {
    return api.post('/payments/create-policy-order', payload);
  },
  verifyPolicyPayment(payload: Record<string, unknown>) {
    return api.post('/payments/verify-policy-payment', payload);
  },
  createPublicOrder(payload: Record<string, unknown>) {
    return api.post('/payments/public/create-order', payload);
  },
  verifyPublicPayment(payload: Record<string, unknown>) {
    return api.post('/payments/public/verify', payload);
  },
  createGuestPolicyOrder(policyId: string, guestToken: string) {
    return guestFetch(`/guest/policies/${encodeURIComponent(policyId)}/payments/orders`, {
      method: 'POST',
      guestToken,
      body: JSON.stringify({ currency: 'INR' }),
    });
  },
  verifyGuestPolicyPayment(guestToken: string, payload: Record<string, unknown>) {
    return fetch('/api/guest/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${guestToken}`,
      },
      body: JSON.stringify(payload),
    });
  },
  createDirectCheckoutOrder(productId: string) {
    return fetch('/api/razorpay/checkout-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
  },
  verifyDirectCheckoutPayment(payload: Record<string, unknown>) {
    return fetch('/api/razorpay/checkout-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
};
