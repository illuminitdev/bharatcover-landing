import type { APIGatewayProxyHandler } from 'aws-lambda';
import crypto from 'crypto';
import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../../shared/db/dynamodb-client';
import { fail, ok } from '../../shared/utils/response';
import { tableConfig } from '../../shared/config';
import { sendRegistrationOtpEmail } from '../../shared/services/email-service';

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body ?? '{}') as {
    email?: string;
    phone?: string;
    agentId?: string;
    sessionToken?: string;
  };
  if (!body.email || !body.phone || !body.sessionToken) {
    return fail('email, phone and sessionToken are required', 400);
  }

  if (body.agentId) {
    const referrer = await ddb.send(
      new GetCommand({
        TableName: tableConfig.users,
        Key: { pk: `USER#${body.agentId}`, sk: `USER#${body.agentId}` },
      })
    );
    if (!referrer.Item) return fail('Invalid referrer agentId', 400);
  }

  const duplicate = await ddb.send(
    new QueryCommand({
      TableName: tableConfig.users,
      IndexName: process.env.USERS_EMAIL_GSI_NAME ?? 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': body.email.toLowerCase() },
      Limit: 1,
    })
  );
  if ((duplicate.Items?.length ?? 0) > 0) return fail('Email already registered', 409);

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  await ddb.send(
    new PutCommand({
      TableName: tableConfig.users,
      Item: {
        pk: `PENDING_CUSTOMER#${body.sessionToken}`,
        sk: 'REGISTRATION',
        sessionToken: body.sessionToken,
        email: body.email.toLowerCase(),
        phone: body.phone,
        agentId: body.agentId ?? null,
        otpHash,
        otpAttempts: 0,
        createdAt: new Date().toISOString(),
      },
    })
  );

  await sendRegistrationOtpEmail(body.email.toLowerCase(), otp);
  return ok({ pending: true, sessionToken: body.sessionToken });
};
