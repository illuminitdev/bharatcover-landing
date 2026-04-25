import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { z } from 'zod';
import { getDocClient } from '../common/dynamo';
import { bearerToken, verifyGuestToken } from '../common/guest-token';
import { json, parseJson } from '../common/http';
import { ddbKey, pk, sk } from '../common/keys';
import { getSsmSecret, guestSessionSecretParam } from '../common/secrets';

const detailsBody = z
  .object({
    fullName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    nomineeName: z.string().optional(),
    nomineeRelation: z.string().optional(),
    address: z.record(z.unknown()).optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .passthrough();

const statusBody = z.object({
  status: z.enum(['DRAFT', 'PENDING_PAYMENT', 'PAID', 'ISSUED', 'CANCELLED']),
  reason: z.string().optional(),
});

async function requireGuestAuth(
  event: Parameters<APIGatewayProxyHandler>[0],
  policyId: string
): Promise<
  { payload: import('../common/guest-token').GuestTokenPayload } | { error: ReturnType<typeof json> }
> {
  const hdr = bearerToken(event);
  if (!hdr) return { error: json(401, { error: 'Missing Authorization Bearer guest token' }, event) };
  const secret = await getSsmSecret(guestSessionSecretParam());
  const payload = verifyGuestToken(hdr, secret);
  if (!payload || payload.policyId !== policyId) {
    return { error: json(403, { error: 'Token not valid for this policy' }, event) };
  }
  return { payload };
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const policiesTable = process.env.POLICIES_TABLE;
  if (!policiesTable) return json(500, { error: 'POLICIES_TABLE not configured' }, event);

  const method = event.httpMethod;
  const policyId = event.pathParameters?.policyId;
  if (!policyId) return json(400, { error: 'policyId required' }, event);

  const path = event.path ?? '';
  const isStatusRoute = /\/guest\/policies\/[^/]+\/status\/?$/.test(path);
  const doc = getDocClient();

  if (method === 'PATCH' && !isStatusRoute) {
    const auth = await requireGuestAuth(event, policyId);
    if ('error' in auth) return auth.error;

    const body = parseJson<unknown>(event);
    const parsed = detailsBody.safeParse(body);
    if (!parsed.success) {
      return json(400, { error: 'Invalid body', details: parsed.error.flatten() }, event);
    }

    const now = Math.floor(Date.now() / 1000);
    const updates: Record<string, unknown> = { ...parsed.data, updatedAt: now };

    const exprNames: Record<string, string> = { '#ua': 'updatedAt' };
    const exprValues: Record<string, unknown> = { ':ua': now };
    const sets: string[] = ['#ua = :ua'];
    let i = 0;
    for (const [k, v] of Object.entries(updates)) {
      if (k === 'updatedAt') continue;
      const nk = `#f${i}`;
      const vk = `:v${i}`;
      exprNames[nk] = k;
      exprValues[vk] = v;
      sets.push(`${nk} = ${vk}`);
      i++;
    }

    try {
      await doc.send(
        new UpdateCommand({
          TableName: policiesTable,
          Key: ddbKey(pk.policy(policyId), sk.metadata),
          UpdateExpression: 'SET ' + sets.join(', '),
          ExpressionAttributeNames: exprNames,
          ExpressionAttributeValues: exprValues,
          ConditionExpression: 'attribute_exists(PK)',
        })
      );
    } catch (e) {
      console.error(e);
      return json(500, { error: 'Failed to update policy' }, event);
    }

    return json(200, { ok: true, policyId }, event);
  }

  if (method === 'PATCH' && isStatusRoute) {
    const auth = await requireGuestAuth(event, policyId);
    if ('error' in auth) return auth.error;

    const body = parseJson<unknown>(event);
    const parsed = statusBody.safeParse(body);
    if (!parsed.success) {
      return json(400, { error: 'Invalid body', details: parsed.error.flatten() }, event);
    }

    const now = Math.floor(Date.now() / 1000);
    try {
      if (parsed.data.reason != null) {
        await doc.send(
          new UpdateCommand({
            TableName: policiesTable,
            Key: ddbKey(pk.policy(policyId), sk.metadata),
            UpdateExpression: 'SET #st = :st, #ua = :ua, #rs = :rs',
            ExpressionAttributeNames: {
              '#st': 'status',
              '#ua': 'updatedAt',
              '#rs': 'statusReason',
            },
            ExpressionAttributeValues: {
              ':st': parsed.data.status,
              ':ua': now,
              ':rs': parsed.data.reason,
            },
            ConditionExpression: 'attribute_exists(PK)',
          })
        );
      } else {
        await doc.send(
          new UpdateCommand({
            TableName: policiesTable,
            Key: ddbKey(pk.policy(policyId), sk.metadata),
            UpdateExpression: 'SET #st = :st, #ua = :ua',
            ExpressionAttributeNames: { '#st': 'status', '#ua': 'updatedAt' },
            ExpressionAttributeValues: {
              ':st': parsed.data.status,
              ':ua': now,
            },
            ConditionExpression: 'attribute_exists(PK)',
          })
        );
      }
    } catch (e) {
      console.error(e);
      return json(500, { error: 'Failed to update status' }, event);
    }

    return json(200, { ok: true, policyId, status: parsed.data.status }, event);
  }

  if (method === 'GET') {
    const auth = await requireGuestAuth(event, policyId);
    if ('error' in auth) return auth.error;

    const out = await doc.send(
      new GetCommand({
        TableName: policiesTable,
        Key: ddbKey(pk.policy(policyId), sk.metadata),
      })
    );
    if (!out.Item) return json(404, { error: 'Policy not found' }, event);
    return json(200, { policy: out.Item }, event);
  }

  return json(405, { error: 'Method not allowed' }, event);
};
