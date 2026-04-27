import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { z } from 'zod';
import { getDocClient } from '../common/dynamo';
import { bearerToken, verifyGuestToken } from '../common/guest-token';
import { json, parseJson } from '../common/http';
import { ddbKey, pk, sk } from '../common/keys';
import {
  getSsmSecret,
  guestSessionSecretParam,
  surepassApiKeyParam,
} from '../common/secrets';
import type { GuestTokenPayload } from '../common/guest-token';

const startBody = z.object({
  flow: z.string().optional(),
  redirectUrl: z.string().url().optional(),
});

const resultBody = z
  .object({
    status: z.enum(['success', 'failed', 'pending']),
    vendorReference: z.string().optional(),
    /** Dummy KYC sends nested objects; avoid z.record strictness on deep trees. */
    raw: z.any().optional(),
  })
  .passthrough();

async function authPolicy(
  event: Parameters<APIGatewayProxyHandler>[0],
  policyId: string
): Promise<{ payload: GuestTokenPayload } | { error: ReturnType<typeof json> }> {
  const hdr = bearerToken(event);
  if (!hdr) return { error: json(401, { error: 'Missing guest token' }, event) };
  const secret = await getSsmSecret(guestSessionSecretParam());
  const payload = verifyGuestToken(hdr, secret);
  if (!payload || payload.policyId !== policyId) {
    return { error: json(403, { error: 'Invalid token' }, event) };
  }
  return { payload };
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const policiesTable = process.env.POLICIES_TABLE;
  const kycTable = process.env.KYC_RECORDS_TABLE;
  if (!policiesTable || !kycTable) {
    return json(500, { error: 'Table env not configured' }, event);
  }

  const policyId = event.pathParameters?.policyId;
  if (!policyId) return json(400, { error: 'policyId required' }, event);

  const path = event.path ?? '';
  const isResult = /\/kyc\/result\/?$/.test(path);

  const doc = getDocClient();

  if (event.httpMethod === 'POST' && !isResult) {
    const authResult = await authPolicy(event, policyId);
    if ('error' in authResult) return authResult.error;

    const body = parseJson<unknown>(event);
    const parsed = startBody.safeParse(body ?? {});
    if (!parsed.success) {
      return json(400, { error: 'Invalid body', details: parsed.error.flatten() }, event);
    }

    const kycId = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const surepassUrl = process.env.SUREPASS_API_URL ?? 'https://sandbox.surepass.app';
    const surepassEnv = process.env.SUREPASS_ENV ?? 'sandbox';

    let vendorPayload: Record<string, unknown> | null = null;
    try {
      const apiKey = await getSsmSecret(surepassApiKeyParam());
      const spRes = await fetch(`${surepassUrl.replace(/\/$/, '')}/api/v1/digilocker/status?client_id=connectivity`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      }).catch(() => null);
      vendorPayload = {
        surepassEnv,
        pingStatus: spRes?.status ?? 'unreachable',
        note: 'Replace health ping with real SurePass flow from insurance-platform KYC lambdas.',
      };
    } catch {
      vendorPayload = { surepassEnv, note: 'SurePass SSM not readable or API unreachable' };
    }

    const kycItem = {
      ...ddbKey(pk.kycRecord(kycId), sk.metadata),
      entityType: 'KYC_RECORD',
      kycId,
      policyId,
      customerId: authResult.payload.customerId,
      status: 'INITIATED',
      vendor: 'SUREPASS',
      vendorPayload,
      createdAt: now,
      updatedAt: now,
    };

    await doc.send(new PutCommand({ TableName: kycTable, Item: kycItem }));

    await doc.send(
      new UpdateCommand({
        TableName: policiesTable,
        Key: ddbKey(pk.policy(policyId), sk.metadata),
        UpdateExpression: 'SET #kyc = :kyc, #ua = :ua',
        ExpressionAttributeNames: { '#kyc': 'latestKycId', '#ua': 'updatedAt' },
        ExpressionAttributeValues: { ':kyc': kycId, ':ua': now },
        ConditionExpression: 'attribute_exists(PK)',
      })
    );

    return json(
      201,
      {
        kycId,
        policyId,
        surepass: {
          env: surepassEnv,
          message: 'Complete SurePass SDK flow in browser or server-side per main platform.',
        },
      },
      event
    );
  }

  if (event.httpMethod === 'POST' && isResult) {
    const authResult2 = await authPolicy(event, policyId);
    if ('error' in authResult2) return authResult2.error;

    const body = parseJson<unknown>(event);
    const parsed = resultBody.safeParse(body);
    if (!parsed.success) {
      return json(400, { error: 'Invalid body', details: parsed.error.flatten() }, event);
    }

    const policyRow = await doc.send(
      new GetCommand({
        TableName: policiesTable,
        Key: ddbKey(pk.policy(policyId), sk.metadata),
      })
    );
    const latestKycId = policyRow.Item?.latestKycId as string | undefined;
    if (!latestKycId) {
      return json(400, { error: 'No KYC started for this policy' }, event);
    }

    const now = Math.floor(Date.now() / 1000);
    const rawVal = parsed.data.raw ?? parsed.data;
    const kycData =
      typeof rawVal === 'object' && rawVal !== null && 'kycData' in rawVal
        ? (rawVal as { kycData?: { provider?: string } }).kycData
        : undefined;
    const isDummyKyc = kycData?.provider === 'dummy_kyc';

    const exprNames: Record<string, string> = {
      '#st': 'status',
      '#ua': 'updatedAt',
      '#raw': 'resultPayload',
    };
    const exprVals: Record<string, unknown> = {
      ':st': parsed.data.status.toUpperCase(),
      ':ua': now,
      ':raw': rawVal,
    };
    let updateExpr = 'SET #st = :st, #ua = :ua, #raw = :raw';
    if (isDummyKyc) {
      updateExpr += ', #vendor = :vendor';
      exprNames['#vendor'] = 'vendor';
      exprVals[':vendor'] = 'dummy_kyc';
    }

    await doc.send(
      new UpdateCommand({
        TableName: kycTable,
        Key: ddbKey(pk.kycRecord(latestKycId), sk.metadata),
        UpdateExpression: updateExpr,
        ExpressionAttributeNames: exprNames,
        ExpressionAttributeValues: exprVals,
      })
    );

    await doc.send(
      new UpdateCommand({
        TableName: policiesTable,
        Key: ddbKey(pk.policy(policyId), sk.metadata),
        UpdateExpression: 'SET #kst = :kst, #ua = :ua',
        ExpressionAttributeNames: { '#kst': 'kycStatus', '#ua': 'updatedAt' },
        ExpressionAttributeValues: {
          ':kst': parsed.data.status.toUpperCase(),
          ':ua': now,
        },
      })
    );

    return json(200, { ok: true, kycId: latestKycId, status: parsed.data.status }, event);
  }

  return json(405, { error: 'Method not allowed' }, event);
};
