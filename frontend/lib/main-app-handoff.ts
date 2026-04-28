/**
 * Builds the redirect URL the post-payment confirmation step uses to send the
 * customer to the main BharatCover Personal/Organisation login.
 *
 * Two modes layered into a single URL:
 *  - Mode A (preferred): `?handoff=<jwt>&next=<path>` — main app exchanges
 *    the JWT at /auth/handoff-exchange and signs the user in automatically.
 *  - Mode B (fallback):  `?email=<urlencoded>&tab=personal` — main app
 *    prefills the Personal login form. User types the password they got
 *    in email.
 *
 * Both sets of params are always sent. The main app honours `handoff` first
 * and falls back to `email`/`tab` if the token is missing or invalid.
 *
 * NEVER include the password, OTP, or any other secret in the URL.
 */

const FALLBACK_PROD_URL = 'https://bharatcover-insurance.vercel.app';
const FALLBACK_DEV_URL = 'http://localhost:3000';

export const MAIN_APP_DEFAULT_NEXT = '/customer/policies';

function readMainAppBase(): string {
  const explicit = process.env.NEXT_PUBLIC_MAIN_APP_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return FALLBACK_DEV_URL;
  }
  return FALLBACK_PROD_URL;
}

function stripTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export type BuildMainAppLoginUrlInput = {
  email: string;
  handoffToken?: string | null;
  next?: string;
};

export function buildMainAppLoginUrl(input: BuildMainAppLoginUrlInput): string {
  const base = readMainAppBase();
  const params = new URLSearchParams();

  const email = input.email.trim().toLowerCase();
  if (email) {
    params.set('email', email);
    params.set('tab', 'personal');
  }

  if (input.handoffToken) {
    params.set('handoff', input.handoffToken);
  }

  const nextPath = (input.next || process.env.NEXT_PUBLIC_MAIN_APP_DEFAULT_NEXT || MAIN_APP_DEFAULT_NEXT).trim();
  if (nextPath) {
    params.set('next', nextPath.startsWith('/') ? nextPath : `/${nextPath}`);
  }

  const qs = params.toString();
  return qs ? `${base}/?${qs}` : `${base}/`;
}
