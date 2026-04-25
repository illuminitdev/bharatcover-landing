/**
 * Optional “direct” Razorpay checkout for local/dev when guest API (NEXT_PUBLIC_API_URL)
 * is not configured. Gated off in production unless explicitly enabled.
 */

/** Catalog totals incl. GST (rupees) — must match checkout productMap for direct-order validation. */
export const RAZORPAY_DIRECT_PRODUCT_TOTALS_RUPEES: Record<string, number> = {
  'pa-lite': 24,
  'pa-standard': 118,
  'pa-10l': 236,
  'pa-premium': 354,
};

export function isServerDirectCheckoutRazorpayAllowed(): boolean {
  if (process.env.ENABLE_CHECKOUT_DIRECT_RAZORPAY_IN_PRODUCTION === 'true') return true;
  return process.env.NODE_ENV !== 'production';
}

/** Client may use direct Razorpay fallback when guest session is missing. */
export function isClientDirectCheckoutRazorpayAllowed(): boolean {
  if (process.env.NEXT_PUBLIC_CHECKOUT_DIRECT_RAZORPAY === 'true') return true;
  if (process.env.NEXT_PUBLIC_CHECKOUT_DIRECT_RAZORPAY === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

export function getRazorpayKeyIdForServer(): string {
  return (
    process.env.RAZORPAY_KEY_ID?.trim() ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
    ''
  );
}

/**
 * API Key Secret (server only). `NEXT_PUBLIC_*` cannot be used for this — it would ship to the browser.
 * Also accepts RAZORPAY_SECRET (common in docs/examples).
 */
export function getRazorpayKeySecretForServer(): string {
  return (
    process.env.RAZORPAY_KEY_SECRET?.trim() ||
    process.env.RAZORPAY_SECRET?.trim() ||
    ''
  );
}

export function getExpectedAmountPaiseForProduct(productId: string): number | null {
  const rupees = RAZORPAY_DIRECT_PRODUCT_TOTALS_RUPEES[productId];
  return rupees == null ? null : rupees * 100;
}
