import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../../shared/db/dynamodb-client';
import { tableConfig } from '../../shared/config';

export async function completeCustomerSelfRegistration(input: {
  userId: string;
  email: string;
  phone: string;
  agentId?: string;
}) {
  await ddb.send(
    new PutCommand({
      TableName: tableConfig.customers,
      Item: {
        pk: `CUSTOMER#${input.userId}`,
        sk: `PROFILE#${input.userId}`,
        userId: input.userId,
        email: input.email,
        phone: input.phone,
        source: 'self_registration',
        createdAt: new Date().toISOString(),
      },
    })
  );

  await ddb.send(
    new UpdateCommand({
      TableName: tableConfig.customers,
      Key: { pk: `CUSTOMER#${input.userId}`, sk: 'META' },
      UpdateExpression: 'SET updatedAt = :u, agentId = :a',
      ExpressionAttributeValues: {
        ':u': new Date().toISOString(),
        ':a': input.agentId ?? null,
      },
    })
  );
}
