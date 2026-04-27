import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../db/dynamodb-client';
import { tableConfig } from '../config';

export async function createNotification(input: {
  userId: string;
  title: string;
  message: string;
}): Promise<void> {
  const now = new Date().toISOString();
  await ddb.send(
    new PutCommand({
      TableName: tableConfig.notifications,
      Item: {
        pk: `USER#${input.userId}`,
        sk: `NOTIF#${now}`,
        title: input.title,
        message: input.message,
        createdAt: now,
      },
    })
  );
}
