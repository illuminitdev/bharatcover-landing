import type { APIGatewayProxyHandler } from 'aws-lambda';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../../shared/db/dynamodb-client';
import { tableConfig } from '../../shared/config';
import { fail, ok } from '../../shared/utils/response';
import { verifyPaymentSchema } from '../../shared/utils/validation';
import { verifyPublicPolicyPaymentSignature } from '../payments/verify-public-policy-payment';

export const handler: APIGatewayProxyHandler = async (event) => {
  const parsedBody = verifyPaymentSchema.safeParse(JSON.parse(event.body ?? '{}'));
  if (!parsedBody.success) return fail(parsedBody.error.message, 400);

  const isValid = verifyPublicPolicyPaymentSignature(parsedBody.data);
  if (!isValid) return fail('Payment signature mismatch', 400);

  const now = new Date().toISOString();
  await ddb.send(
    new UpdateCommand({
      TableName: tableConfig.payments,
      Key: { pk: `PAYMENT#${parsedBody.data.orderId}`, sk: `PAYMENT#${parsedBody.data.orderId}` },
      UpdateExpression: 'SET #status = :status, paymentId = :paymentId, verifiedAt = :now',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': 'PAID',
        ':paymentId': parsedBody.data.paymentId,
        ':now': now,
      },
    })
  );

  await ddb.send(
    new UpdateCommand({
      TableName: tableConfig.policies,
      Key: { pk: `POLICY#${parsedBody.data.policyId}`, sk: `POLICY#${parsedBody.data.policyId}` },
      UpdateExpression: 'SET #status = :status, paymentVerifiedAt = :now',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': 'ACTIVE', ':now': now },
    })
  );

  return ok({ verified: true, policyId: parsedBody.data.policyId });
};
