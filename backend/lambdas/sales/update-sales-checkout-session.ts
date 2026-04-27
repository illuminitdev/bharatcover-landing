import type { APIGatewayProxyHandler } from 'aws-lambda';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../../shared/db/dynamodb-client';
import { tableConfig } from '../../shared/config';
import { fail, ok } from '../../shared/utils/response';
import { updateSessionSchema } from '../../shared/utils/validation';

export const handler: APIGatewayProxyHandler = async (event) => {
  const parsedBody = updateSessionSchema.safeParse(JSON.parse(event.body ?? '{}'));
  if (!parsedBody.success) return fail(parsedBody.error.message, 400);

  await ddb.send(
    new UpdateCommand({
      TableName: tableConfig.customers,
      Key: {
        pk: `CHECKOUT#${parsedBody.data.sessionId}`,
        sk: `CHECKOUT#${parsedBody.data.sessionId}`,
      },
      UpdateExpression: 'SET currentStep = :step, stepData.#step = :payload, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#step': parsedBody.data.step },
      ExpressionAttributeValues: {
        ':step': parsedBody.data.step,
        ':payload': parsedBody.data.payload,
        ':updatedAt': new Date().toISOString(),
      },
    })
  );

  return ok({ sessionId: parsedBody.data.sessionId, savedStep: parsedBody.data.step });
};
