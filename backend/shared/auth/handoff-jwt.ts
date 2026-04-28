import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

/**
 * Server-only minter for the post-payment handoff token consumed by the
 * main BharatCover app at POST /auth/handoff-exchange.
 *
 * Contract (must match frontend/lib/handoff-jwt.ts exactly):
 *  - Algorithm: HS256
 *  - Payload:   { email, jti, iat, exp }
 *  - Lifetime:  5 minutes
 *  - Single-use: enforced by the main app via `jti` table.
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
