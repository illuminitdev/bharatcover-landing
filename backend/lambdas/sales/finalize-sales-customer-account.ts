import type { APIGatewayProxyHandler } from 'aws-lambda';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../../shared/db/dynamodb-client';
import { tableConfig } from '../../shared/config';
import { createCustomerLoginAccount } from '../../shared/auth/customer-self-registration';
import { sendAccountCredentialsEmail } from '../../shared/services/email-service';
import { createNotification } from '../../shared/services/notification-service';
import { fail, ok } from '../../shared/utils/response';

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body ?? '{}') as { sessionId?: string; policyId?: string };
  if (!body.sessionId || !body.policyId) return fail('sessionId and policyId are required');

  const checkout = await ddb.send(
    new GetCommand({
      TableName: tableConfig.customers,
      Key: { pk: `CHECKOUT#${body.sessionId}`, sk: `CHECKOUT#${body.sessionId}` },
    })
  );

  const customer = (checkout.Item ?? {}) as { email?: string; phone?: string };
  if (!customer.email || !customer.phone) return fail('Checkout session not found', 404);

  const customerId = body.policyId;
  const account = await createCustomerLoginAccount({
    customerId,
    email: customer.email,
    phone: customer.phone,
  });

  await sendAccountCredentialsEmail(customer.email, account.tempPassword);
  await createNotification({
    userId: customerId,
    title: 'Policy Purchased',
    message: 'Your policy purchase is complete. Credentials have been emailed.',
  });

  await ddb.send(
    new UpdateCommand({
      TableName: tableConfig.policies,
      Key: { pk: `POLICY#${body.policyId}`, sk: `POLICY#${body.policyId}` },
      UpdateExpression: 'SET accountFinalized = :yes, accountFinalizedAt = :at',
      ExpressionAttributeValues: { ':yes': true, ':at': new Date().toISOString() },
    })
  );

  return ok({ accountCreated: true });
};
