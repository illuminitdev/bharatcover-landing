import type { APIGatewayProxyHandler } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../../shared/db/dynamodb-client';
import { tableConfig } from '../../shared/config';
import { fail, ok } from '../../shared/utils/response';
import { createOrderSchema } from '../../shared/utils/validation';
import { createPolicyDraft } from '../policies/purchase-policy';
import { buildPublicPolicyOrder } from '../payments/create-public-policy-order';

export const handler: APIGatewayProxyHandler = async (event) => {
  const parsedBody = createOrderSchema.safeParse(JSON.parse(event.body ?? '{}'));
  if (!parsedBody.success) return fail(parsedBody.error.message, 400);

  const order = buildPublicPolicyOrder({
    amount: parsedBody.data.amount,
    currency: parsedBody.data.currency,
    receipt: parsedBody.data.policyId,
  });

  await createPolicyDraft({
    policyId: parsedBody.data.policyId,
    sessionId: parsedBody.data.sessionId,
    productId: 'public-sales',
    premiumAmount: parsedBody.data.amount,
    customer: {},
  });

  await ddb.send(
    new PutCommand({
      TableName: tableConfig.payments,
      Item: {
        pk: `PAYMENT#${order.orderId}`,
        sk: `PAYMENT#${order.orderId}`,
        policyId: parsedBody.data.policyId,
        sessionId: parsedBody.data.sessionId,
        amount: parsedBody.data.amount,
        currency: parsedBody.data.currency,
        status: 'ORDER_CREATED',
        createdAt: new Date().toISOString(),
      },
    })
  );

  return ok(order, 201);
};
