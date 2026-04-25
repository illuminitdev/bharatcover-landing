import { TransactWriteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { z } from 'zod';
import { getDocClient } from '../common/dynamo';
import { bearerToken, signGuestToken, verifyGuestToken } from '../common/guest-token';
import { json, parseJson } from '../common/http';
import { ddbKey, pk, sk } from '../common/keys';
import { getSsmSecret, guestSessionSecretParam } from '../common/secrets';

const createBody = z.object({
  productId: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  leadSource: z.string().optional(),
});

const TOKEN_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

export const handler: APIGatewayProxyHandler = async (event) => {
  const customersTable = process.env.CUSTOMERS_TABLE;
  const policiesTable = process.env.POLICIES_TABLE;
  if (!customersTable || !policiesTable) {
    return json(500, { error: 'Table env not configured' }, event);
  }

  const doc = getDocClient();
  const method = event.httpMethod;
  const sessionIdParam = event.pathParameters?.sessionId;

  if (method === 'POST' && !sessionIdParam) {
    const body = parseJson<unknown>(event);
    const parsed = createBody.safeParse(body);
    if (!parsed.success) {
      return json(400, { error: 'Invalid body', details: parsed.error.flatten() }, event);
    }
    const { productId, phone, email, leadSource } = parsed.data;

    const customerId = randomUUID();
    const policyId = randomUUID();
    const sessionId = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const exp = now + TOKEN_TTL_SEC;

    const customerItem = {
      ...ddbKey(pk.customer(customerId), sk.metadata),
      entityType: 'CUSTOMER',
      customerId,
      phone: phone ?? null,
      email: email ?? null,
      leadSource: leadSource ?? 'landing_guest',
      createdAt: now,
      updatedAt: now,
    };

    const policyItem = {
      ...ddbKey(pk.policy(policyId), sk.metadata),
      entityType: 'POLICY',
      policyId,
      customerId,
      productId,
      status: 'DRAFT',
      channel: 'landing_guest',
      createdAt: now,
      updatedAt: now,
    };

    const sessionItem = {
      ...ddbKey(pk.session(sessionId), sk.metadata),
      entityType: 'GUEST_SESSION',
      sessionId,
      customerId,
      policyId,
      productId,
      exp,
      createdAt: now,
    };

    let secret: string;
    try {
      secret = await getSsmSecret(guestSessionSecretParam());
    } catch (e) {
      console.error('guest-sessions SSM guest-session-hmac-secret', e);
      return json(
        500,
        {
          error: 'Auth misconfigured',
          hint: 'Create SSM SecureString at GUEST_SESSION_SECRET_PARAM (see infra/cdk/README.md).',
        },
        event
      );
    }

    try {
      await doc.send(
        new TransactWriteCommand({
          TransactItems: [
            { Put: { TableName: customersTable, Item: customerItem } },
            { Put: { TableName: policiesTable, Item: policyItem } },
            { Put: { TableName: policiesTable, Item: sessionItem } },
          ],
        })
      );
    } catch (e) {
      console.error('guest-sessions TransactWrite', e);
      return json(500, { error: 'Failed to create session' }, event);
    }

    const token = signGuestToken({ customerId, policyId, sessionId, exp }, secret);

    return json(
      201,
      {
        sessionId,
        policyId,
        customerId,
        guestToken: token,
        expiresAt: exp,
      },
      event
    );
  }

  if (method === 'GET' && sessionIdParam) {
    const out = await doc.send(
      new GetCommand({
        TableName: policiesTable,
        Key: ddbKey(pk.session(sessionIdParam), sk.metadata),
      })
    );
    if (!out.Item || out.Item.entityType !== 'GUEST_SESSION') {
      return json(404, { error: 'Session not found' }, event);
    }
    const exp = Number(out.Item.exp ?? 0);
    if (exp < Math.floor(Date.now() / 1000)) {
      return json(410, { error: 'Session expired' }, event);
    }

    const hdr = bearerToken(event);
    if (!hdr) {
      return json(401, { error: 'Authorization Bearer guest token required' }, event);
    }
    let payload;
    try {
      const secret = await getSsmSecret(guestSessionSecretParam());
      payload = verifyGuestToken(hdr, secret);
    } catch {
      return json(500, { error: 'Auth misconfigured' }, event);
    }
    if (!payload || payload.sessionId !== sessionIdParam) {
      return json(403, { error: 'Invalid token' }, event);
    }

    return json(
      200,
      {
        sessionId: sessionIdParam,
        customerId: out.Item.customerId,
        policyId: out.Item.policyId,
        productId: out.Item.productId,
      },
      event
    );
  }

  return json(405, { error: 'Method not allowed' }, event);
};
