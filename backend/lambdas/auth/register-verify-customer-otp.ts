import type { APIGatewayProxyHandler } from 'aws-lambda';
import crypto from 'crypto';
import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../../shared/db/dynamodb-client';
import { fail, ok } from '../../shared/utils/response';
import { tableConfig } from '../../shared/config';
import { createCognitoUser, setPermanentPassword, adminLogin } from '../../shared/auth/cognito-client';
import { completeCustomerSelfRegistration } from './shared-registration';

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body ?? '{}') as {
    sessionToken?: string;
    otp?: string;
    password?: string;
    fullName?: string;
  };
  if (!body.sessionToken || !body.otp || !body.password) {
    return fail('sessionToken, otp and password are required', 400);
  }

  const pending = await ddb.send(
    new GetCommand({
      TableName: tableConfig.users,
      Key: { pk: `PENDING_CUSTOMER#${body.sessionToken}`, sk: 'REGISTRATION' },
    })
  );
  const pendingItem = pending.Item as
    | { email?: string; phone?: string; otpHash?: string; otpAttempts?: number; agentId?: string }
    | undefined;
  if (!pendingItem?.email || !pendingItem.phone || !pendingItem.otpHash) {
    return fail('Pending registration not found', 404);
  }

  const receivedOtpHash = crypto.createHash('sha256').update(body.otp).digest('hex');
  if (receivedOtpHash !== pendingItem.otpHash) {
    await ddb.send(
      new UpdateCommand({
        TableName: tableConfig.users,
        Key: { pk: `PENDING_CUSTOMER#${body.sessionToken}`, sk: 'REGISTRATION' },
        UpdateExpression: 'SET otpAttempts = if_not_exists(otpAttempts, :z) + :one',
        ExpressionAttributeValues: { ':one': 1, ':z': 0 },
      })
    );
    return fail('Invalid OTP', 401);
  }

  const userId = crypto.randomUUID();
  await ddb.send(
    new PutCommand({
      TableName: tableConfig.users,
      Item: {
        pk: `USER#${userId}`,
        sk: `USER#${userId}`,
        userId,
        email: pendingItem.email,
        phone: pendingItem.phone,
        role: 'customer',
        fullName: body.fullName ?? '',
        createdAt: new Date().toISOString(),
      },
    })
  );

  await completeCustomerSelfRegistration({
    userId,
    email: pendingItem.email,
    phone: pendingItem.phone,
    agentId: pendingItem.agentId,
  });

  await createCognitoUser(pendingItem.email, body.password);
  await setPermanentPassword(pendingItem.email, body.password);
  const auth = await adminLogin(pendingItem.email, body.password);

  await ddb.send(
    new DeleteCommand({
      TableName: tableConfig.users,
      Key: { pk: `PENDING_CUSTOMER#${body.sessionToken}`, sk: 'REGISTRATION' },
    })
  );

  return ok({
    userId,
    accessToken: auth.AuthenticationResult?.AccessToken,
    refreshToken: auth.AuthenticationResult?.RefreshToken,
    idToken: auth.AuthenticationResult?.IdToken,
  });
};
