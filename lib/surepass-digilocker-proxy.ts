/**
 * Server-only helpers for proxying SurePass DigiLocker APIs.
 * Never import this module from client components.
 */

const DEFAULT_BASE = 'https://sandbox.surepass.app';
const DEFAULT_INIT_PATH = '/api/v1/digilocker/initialize';
const DEFAULT_STATUS_PATH = '/api/v1/digilocker/status';

export function getSurepassApiBase(): string {
  const raw = process.env.SUREPASS_API_URL?.trim() || DEFAULT_BASE;
  return raw.replace(/\/+$/, '');
}

export function getSurepassInitPath(): string {
  const p = process.env.SUREPASS_DIGILOCKER_INIT_PATH?.trim() || DEFAULT_INIT_PATH;
  return p.startsWith('/') ? p : `/${p}`;
}

export function getSurepassStatusPath(): string {
  const p = process.env.SUREPASS_DIGILOCKER_STATUS_PATH?.trim() || DEFAULT_STATUS_PATH;
  return p.startsWith('/') ? p : `/${p}`;
}

export function getSurepassApiKey(): string | null {
  const k = process.env.SUREPASS_API_KEY?.trim();
  return k || null;
}

export function getSurepassEnvLabel(): string {
  return process.env.SUREPASS_ENV?.trim() || 'sandbox';
}

function normalizeOrigin(urlStr: string): string | null {
  try {
    const u = new URL(urlStr);
    return u.origin;
  } catch {
    return null;
  }
}

/** Restrict redirect_url to known app origins (mitigate open redirects). */
export function isAllowedDigilockerRedirectUrl(redirectUrl: string): boolean {
  let u: URL;
  try {
    u = new URL(redirectUrl);
  } catch {
    return false;
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;

  const candidates: string[] = [];
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    const o = normalizeOrigin(site);
    if (o) candidates.push(o);
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    const o = normalizeOrigin(appUrl);
    if (o) candidates.push(o);
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) candidates.push(`https://${vercel}`);

  const extra = process.env.SUREPASS_ALLOWED_REDIRECT_ORIGINS?.trim();
  if (extra) {
    for (const part of extra.split(',')) {
      const o = normalizeOrigin(part.trim());
      if (o) candidates.push(o);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    candidates.push('http://localhost:3000', 'http://127.0.0.1:3000');
  }

  const origin = u.origin;
  return candidates.some((c) => c === origin);
}

export function extractDigilockerLink(json: Record<string, unknown>): string | null {
  const data = json.data;
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const keys = ['url', 'link', 'authorization_url', 'digilocker_url', 'digilocker_link', 'webview_url'];
  for (const k of keys) {
    const v = d[k];
    if (typeof v === 'string' && /^https?:\/\//i.test(v)) return v;
  }
  return null;
}

export function extractDigilockerClientId(json: Record<string, unknown>): string | null {
  const data = json.data;
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const v = d.client_id;
  return typeof v === 'string' && v.length > 0 ? v : null;
}

export function digilockerStatusLooksSuccessful(json: Record<string, unknown>): boolean {
  if (json.success === true && json.data && typeof json.data === 'object') {
    const d = json.data as Record<string, unknown>;
    const st = String(d.status ?? d.kyc_status ?? d.verification_status ?? '').toLowerCase();
    if (['success', 'completed', 'verified', 'approved'].includes(st)) return true;
    if (d.verified === true) return true;
  }
  const top = String(json.status ?? '').toLowerCase();
  if (['success', 'completed', 'verified'].includes(top)) return true;
  return false;
}
