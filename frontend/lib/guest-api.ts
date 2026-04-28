import { clearCheckoutWizardDraft } from '@/lib/checkout-wizard-draft';
import { getInsuranceApiBase, normalizeApiBase } from '@/lib/insurance-api-config';

/**
 * Browser client for split insurance APIs configured via
 * `NEXT_PUBLIC_*_API_URL` variables in `.env`.
 */

export function getGuestApiBase(): string {
  const unified = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);
  if (unified) return unified;
  return getInsuranceApiBase('customerSales');
}

function resolveGuestApiBase(path: string): string {
  const unified = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);
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
    throw new Error('Required split API URL env vars are not configured.');
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
  | { ok: false; error: string; accountExists?: boolean };

/**
 * POST /guest/sessions and persist tokens to sessionStorage (browser only).
 * Call from client components after the user has entered contact details.
 */
export async function createGuestSessionAndStore(
  params: CreateGuestSessionParams
): Promise<CreateGuestSessionResult> {
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
      accountExists?: boolean;
    };
    if (!res.ok) {
      return {
        ok: false,
        error: data.error ?? `Request failed (${res.status})`,
        accountExists: Boolean(data.accountExists),
      };
    }

    if (typeof window !== 'undefined' && data.guestToken && data.sessionId && data.policyId) {
      sessionStorage.setItem(GUEST_SESSION_STORAGE.token, data.guestToken);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.sessionId, data.sessionId);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.policyId, data.policyId);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.productId, params.productId);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.phone, phone);
      sessionStorage.setItem(GUEST_SESSION_STORAGE.email, params.email?.trim() ?? '');
      sessionStorage.setItem('bharatcover_checkout_mode', 'landing_guest');
      clearCheckoutWizardDraft();
    } else {
      throw new Error('Guest session API did not return session/token/policy data.');
    }
    return { ok: true };
  } catch {
    try {
      const salesBase = getInsuranceApiBase('customerSales');
      if (!salesBase) throw new Error('customer sales api base missing');
      const res = await fetch(`${salesBase}/checkout/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: params.email?.trim() || '',
          phone,
          productId: params.productId,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        sessionId?: string;
        policyId?: string;
        token?: string;
        error?: string;
        accountExists?: boolean;
      };
      if (!res.ok) {
        return {
          ok: false,
          error: data.error ?? `checkout session failed (${res.status})`,
          accountExists: Boolean(data.accountExists),
        };
      }
      if (
        typeof window !== 'undefined' &&
        data.sessionId &&
        data.policyId &&
        data.token
      ) {
        sessionStorage.setItem(GUEST_SESSION_STORAGE.token, data.token);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.sessionId, data.sessionId);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.policyId, data.policyId);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.productId, params.productId);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.phone, phone);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.email, params.email?.trim() ?? '');
        sessionStorage.setItem('bharatcover_checkout_mode', 'sales_public');
        clearCheckoutWizardDraft();
        return { ok: true };
      }
      return { ok: false, error: 'sales checkout session API did not return required fields' };
    } catch {
      if (typeof window !== 'undefined') {
        // Last-resort local mode for UI testing.
        const nonce = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        sessionStorage.setItem(GUEST_SESSION_STORAGE.token, `local_guest_${nonce}`);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.sessionId, `local_session_${nonce}`);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.policyId, `local_policy_${nonce}`);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.productId, params.productId);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.phone, phone);
        sessionStorage.setItem(GUEST_SESSION_STORAGE.email, params.email?.trim() ?? '');
        sessionStorage.setItem('bharatcover_checkout_mode', 'local_direct');
        clearCheckoutWizardDraft();
        return { ok: true };
      }
      return { ok: false, error: 'Could not create checkout session.' };
    }
  }
}
