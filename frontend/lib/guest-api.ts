import { clearCheckoutWizardDraft } from '@/lib/checkout-wizard-draft';
import { getInsuranceApiBase } from '@/lib/insurance-api-config';

/**
 * Browser client for the **optional unified** landing CDK API (`NEXT_PUBLIC_API_URL`).
 *
 * Split insurance-platform gateways (`NEXT_PUBLIC_POLICY_API_URL`, etc.) are exposed
 * from `lib/insurance-api-config.ts` and `platformFetch` in `lib/insurance-api-client.ts`.
 * Wire those per-route when paths are known; do not assume `/products` exists on every host.
 */

export function getGuestApiBase(): string {
  const unified = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
  if (unified) return unified;
  return getInsuranceApiBase('customerSales');
}

function resolveGuestApiBase(path: string): string {
  const unified = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
  if (unified) return unified;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (
    normalizedPath.startsWith('/guest/payments') ||
    normalizedPath.includes('/payments/orders')
  ) {
    return getInsuranceApiBase('payment');
  }
  if (normalizedPath.includes('/kyc')) {
    return getInsuranceApiBase('kyc');
  }
  if (normalizedPath.startsWith('/products')) {
    return getInsuranceApiBase('policy');
  }
  if (normalizedPath.startsWith('/guest/policies')) {
    return getInsuranceApiBase('policy');
  }
  return getInsuranceApiBase('customerSales');
}

export async function guestFetch(
  path: string,
  init: RequestInit & { guestToken?: string } = {}
): Promise<Response> {
  const base = resolveGuestApiBase(path);
  if (!base) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (init.guestToken) {
    headers.set('Authorization', `Bearer ${init.guestToken}`);
  }
  const { guestToken: _g, ...rest } = init;
  return fetch(`${base}${path.startsWith('/') ? path : `/${path}`}`, {
    ...rest,
    headers,
  });
}

export const GUEST_SESSION_STORAGE = {
  token: 'bharatcover_guest_token',
  sessionId: 'bharatcover_guest_session_id',
  policyId: 'bharatcover_guest_policy_id',
  productId: 'bharatcover_guest_product_id',
  phone: 'bharatcover_guest_phone',
  email: 'bharatcover_guest_email',
  /** Latest Razorpay payment row id (from `POST .../payments/orders`). */
  paymentId: 'bharatcover_guest_payment_id',
  /** Set after successful verify; used for display and certificate filename. */
  certificateNumber: 'bharatcover_guest_certificate_number',
} as const;

export const USER_SESSION_STORAGE = {
  token: 'bharatcover_user_token',
  email: 'bharatcover_user_email',
} as const;

export type CreateGuestSessionParams = {
  productId: string;
  phone: string;
  email?: string;
  leadSource?: string;
};

export type CreateGuestSessionResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * POST /guest/sessions and persist tokens to sessionStorage (browser only).
 * Call from client components after the user has entered contact details.
 */
export async function createGuestSessionAndStore(
  params: CreateGuestSessionParams
): Promise<CreateGuestSessionResult> {
  if (!getGuestApiBase()) {
    return {
      ok: false,
      error:
        'Set NEXT_PUBLIC_API_URL in .env to your landing guest API base URL (no trailing slash), restart Next.js, then try again. See “Path A” in .env.example.',
    };
  }

  const phone = params.phone.replace(/\D/g, '').slice(-10);
  try {
    const res = await guestFetch('/guest/sessions', {
      method: 'POST',
      body: JSON.stringify({
        productId: params.productId,
        phone,
        email: params.email?.trim() || undefined,
        leadSource: params.leadSource ?? 'landing_sales',
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      guestToken?: string;
      sessionId?: string;
      policyId?: string;
    };
    if (!res.ok) {
      return { ok: false, error: data.error ?? `Request failed (${res.status})` };
    }
    if (
      typeof window !== 'undefined' &&
      data.guestToken &&
      data.sessionId &&
      data.policyId
    ) {
      sessionStorage.setItem(GUEST_SESSION_STORAGE.token, data.guestToken);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.sessionId, data.sessionId);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.policyId, data.policyId);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.productId, params.productId);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.phone, phone);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.email, params.email?.trim() ?? '');
      clearCheckoutWizardDraft();
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'Could not reach the insurance API. Check NEXT_PUBLIC_API_URL.',
    };
  }
}
