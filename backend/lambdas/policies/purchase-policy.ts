import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../../shared/db/dynamodb-client';
import { tableConfig } from '../../shared/config';

export async function createPolicyDraft(input: {
  policyId: string;
  sessionId: string;
  productId: string;
  premiumAmount: number;
  customer: Record<string, unknown>;
}): Promise<void> {
  await ddb.send(
    new PutCommand({
      TableName: tableConfig.policies,
      Item: {
        pk: `POLICY#${input.policyId}`,
        sk: `POLICY#${input.policyId}`,
        sessionId: input.sessionId,
        productId: input.productId,
        premiumAmount: input.premiumAmount,
        customer: input.customer,
        status: 'PAYMENT_PENDING',
        createdAt: new Date().toISOString(),
      },
    })
  );
}
