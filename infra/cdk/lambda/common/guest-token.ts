import { createHmac, timingSafeEqual } from 'crypto';

export interface GuestTokenPayload {
  customerId: string;
  policyId: string;
  sessionId: string;
  exp: number;
}

function b64url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function b64urlDecode(s: string): Buffer {
  const pad = 4 - (s.length % 4);
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + (pad < 4 ? '='.repeat(pad) : '');
  return Buffer.from(b64, 'base64');
}

export function signGuestToken(payload: GuestTokenPayload, secret: string): string {
  const body = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  const sig = createHmac('sha256', secret).update(body).digest();
  return `${body}.${b64url(sig)}`;
}

export function verifyGuestToken(token: string, secret: string): GuestTokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sigB64] = parts;
  const expected = createHmac('sha256', secret).update(body).digest();
  let sig: Buffer;
  try {
    sig = b64urlDecode(sigB64);
  } catch {
    return null;
  }
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return null;
  let payload: GuestTokenPayload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString('utf8')) as GuestTokenPayload;
  } catch {
    return null;
  }
  if (payload.exp < Date.now() / 1000) return null;
  return payload;
}

export function bearerToken(event: { headers?: Record<string, string | undefined> | null }): string | null {
  const h =
    event.headers?.Authorization ??
    event.headers?.authorization ??
    event.headers?.['X-Guest-Session'] ??
    event.headers?.['x-guest-session'];
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  return m ? m[1]! : h.trim();
}
