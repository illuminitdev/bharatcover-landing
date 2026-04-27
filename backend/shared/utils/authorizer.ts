import jwt from 'jsonwebtoken';

const defaultSecret = process.env.GUEST_SESSION_SECRET ?? 'replace-me-in-prod';

export function issuePublicSessionToken(sessionId: string): string {
  return jwt.sign({ sessionId }, defaultSecret, { expiresIn: '30m' });
}

export function verifyPublicSessionToken(token: string): { sessionId: string } | null {
  try {
    const decoded = jwt.verify(token, defaultSecret) as { sessionId?: string };
    if (!decoded.sessionId) return null;
    return { sessionId: decoded.sessionId };
  } catch {
    return null;
  }
}
