import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

/**
 * Single-use JWT minted by the landing site after a Cognito user is created
 * for a freshly-paid customer. The main app verifies this token at
 * POST /auth/handoff-exchange, returns Cognito tokens, and tracks the `jti`
 * to ensure the token can only be redeemed once.
 *
 * Keep the payload narrow (no PII beyond email; never the password).
 */
export type HandoffPayload = {
  email: string;
  jti: string;
  iat: number;
  exp: number;
};

const DEFAULT_EXPIRY_SECONDS = 5 * 60;

function getSecret(): string | null {
  const secret = process.env.HANDOFF_JWT_SECRET?.trim();
  return secret && secret.length >= 16 ? secret : null;
}

export function isHandoffSigningConfigured(): boolean {
  return getSecret() !== null;
}

export function mintHandoffToken(email: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const now = Math.floor(Date.now() / 1000);
  const payload: HandoffPayload = {
    email: normalized,
    jti: crypto.randomUUID(),
    iat: now,
    exp: now + DEFAULT_EXPIRY_SECONDS,
  };
  return jwt.sign(payload, secret, { algorithm: 'HS256', noTimestamp: true });
}

export function verifyHandoffToken(token: string): HandoffPayload | null {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as HandoffPayload;
    if (!decoded?.email || !decoded?.jti) return null;
    return decoded;
  } catch {
    return null;
  }
}
