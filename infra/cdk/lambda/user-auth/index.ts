import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto';
import { GetCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { getDocClient } from '../common/dynamo';
import { bearerToken } from '../common/guest-token';
import { json, parseJson } from '../common/http';
import { ddbKey, pk, sk } from '../common/keys';
import { getSsmSecret, guestSessionSecretParam } from '../common/secrets';

type UserTokenPayload = {
  customerId: string;
  exp: number;
  type: 'customer_user';
};

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

function signUserToken(payload: UserTokenPayload, secret: string): string {
  const body = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  const sig = createHmac('sha256', secret).update(body).digest();
  return `${body}.${b64url(sig)}`;
}

function verifyUserToken(token: string, secret: string): UserTokenPayload | null {
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
  let payload: UserTokenPayload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString('utf8')) as UserTokenPayload;
  } catch {
    return null;
  }
  if (payload.exp < Date.now() / 1000 || payload.type !== 'customer_user') return null;
  return payload;
}

function verifyPasswordHash(stored: string, password: string): boolean {
  const [saltB64, hashB64] = stored.split(':');
  if (!saltB64 || !hashB64) return false;
  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');
  const actual = scryptSync(password, salt, 64) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function requireUser(event: APIGatewayProxyEvent): Promise<{ customerId: string } | { error: ReturnType<typeof json> }> {
  const auth = bearerToken(event);
  if (!auth) return { error: json(401, { error: 'Missing user Bearer token' }, event) };
  let secret: string;
  try {
    secret = await getSsmSecret(guestSessionSecretParam());
  } catch (e) {
    return {
      error: json(500, { error: 'Auth secret misconfigured', message: e instanceof Error ? e.message : String(e) }, event),
    };
  }
  const payload = verifyUserToken(auth, secret);
  if (!payload) return { error: json(403, { error: 'Invalid or expired user token' }, event) };
  return { customerId: payload.customerId };
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const usersTable = process.env.USERS_TABLE;
  const policiesTable = process.env.POLICIES_TABLE;
  if (!usersTable || !policiesTable) {
    return json(500, { error: 'USERS_TABLE/POLICIES_TABLE not configured' }, event);
  }
  const path = event.path ?? '';
  const doc = getDocClient();

  if (event.httpMethod === 'POST' && /\/auth\/login\/?$/.test(path)) {
    const body = parseJson<unknown>(event) as { email?: string; password?: string } | null;
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');
    if (!email || !password) {
      return json(400, { error: 'Email and password are required' }, event);
    }
    const users = await doc.send(
      new ScanCommand({
        TableName: usersTable,
        FilterExpression: '#et = :et AND #em = :em',
        ExpressionAttributeNames: { '#et': 'entityType', '#em': 'email' },
        ExpressionAttributeValues: { ':et': 'USER_LOGIN', ':em': email },
        Limit: 1,
      })
    );
    const u = users.Items?.[0];
    if (!u) return json(401, { error: 'Invalid credentials' }, event);
    if (!verifyPasswordHash(String(u.passwordHash ?? ''), password)) {
      return json(401, { error: 'Invalid credentials' }, event);
    }
    const customerId = String(u.customerId ?? '');
    if (!customerId) return json(500, { error: 'User missing customer link' }, event);
    const secret = await getSsmSecret(guestSessionSecretParam());
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
    const token = signUserToken({ customerId, exp, type: 'customer_user' }, secret);

    const pol = await doc.send(
      new ScanCommand({
        TableName: policiesTable,
        FilterExpression: '#et = :et AND #cid = :cid',
        ExpressionAttributeNames: { '#et': 'entityType', '#cid': 'customerId' },
        ExpressionAttributeValues: { ':et': 'POLICY', ':cid': customerId },
        Limit: 50,
      })
    );
    const latest = [...(pol.Items ?? [])]
      .sort((a, b) => Number(b.updatedAt ?? 0) - Number(a.updatedAt ?? 0))[0];
    return json(
      200,
      {
        ok: true,
        token,
        customerId,
        email,
        latestPolicyId: latest?.policyId,
      },
      event
    );
  }

  if (event.httpMethod === 'GET' && /\/user\/policies\/[^/]+\/?$/.test(path)) {
    const auth = await requireUser(event);
    if ('error' in auth) return auth.error;
    const policyId = event.pathParameters?.policyId;
    if (!policyId) return json(400, { error: 'policyId required' }, event);
    const out = await doc.send(
      new GetCommand({
        TableName: policiesTable,
        Key: ddbKey(pk.policy(policyId), sk.metadata),
      })
    );
    if (!out.Item) return json(404, { error: 'Policy not found' }, event);
    if (String(out.Item.customerId ?? '') !== auth.customerId) {
      return json(403, { error: 'Policy does not belong to this user' }, event);
    }
    return json(200, { policy: out.Item }, event);
  }

  if (event.httpMethod === 'GET' && /\/user\/policies\/?$/.test(path)) {
    const auth = await requireUser(event);
    if ('error' in auth) return auth.error;
    const out = await doc.send(
      new ScanCommand({
        TableName: policiesTable,
        FilterExpression: '#et = :et AND #cid = :cid',
        ExpressionAttributeNames: { '#et': 'entityType', '#cid': 'customerId' },
        ExpressionAttributeValues: { ':et': 'POLICY', ':cid': auth.customerId },
        Limit: 100,
      })
    );
    const policies = [...(out.Items ?? [])].sort((a, b) => Number(b.updatedAt ?? 0) - Number(a.updatedAt ?? 0));
    return json(200, { policies }, event);
  }

  return json(405, { error: 'Method not allowed' }, event);
};

