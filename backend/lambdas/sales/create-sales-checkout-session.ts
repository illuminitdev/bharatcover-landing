import type { APIGatewayProxyHandler } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import { ddb } from '../../shared/db/dynamodb-client';
import { tableConfig } from '../../shared/config';
import { issuePublicSessionToken } from '../../shared/utils/authorizer';
import { fail, ok } from '../../shared/utils/response';
import { createSessionSchema, sanitizePhone } from '../../shared/utils/validation';

export const handler: APIGatewayProxyHandler = async (event) => {
  const parsedBody = createSessionSchema.safeParse(JSON.parse(event.body ?? '{}'));
  if (!parsedBody.success) return fail(parsedBody.error.message, 400);

  const now = new Date().toISOString();
  const sessionId = crypto.randomUUID();
  const policyId = crypto.randomUUID();
  const phone = sanitizePhone(parsedBody.data.phone);

  await ddb.send(
    new PutCommand({
      TableName: tableConfig.customers,
      Item: {
        pk: `CHECKOUT#${sessionId}`,
        sk: `CHECKOUT#${sessionId}`,
        sessionId,
        policyId,
        email: parsedBody.data.email.toLowerCase(),
        phone,
        productId: parsedBody.data.productId,
        status: 'SESSION_CREATED',
        currentStep: 'email-phone',
        createdAt: now,
        updatedAt: now,
      },
    })
  );

  return ok({
    sessionId,
    policyId,
    token: issuePublicSessionToken(sessionId),
    nextStep: 'ekyc',
  });
};
