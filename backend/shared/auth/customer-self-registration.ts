import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../db/dynamodb-client';
import { tableConfig, appConfig } from '../config';
import { generateTemporaryPassword, hashRegistrationPassword } from './registration-password-crypto';

export async function createCustomerLoginAccount(input: {
  customerId: string;
  email: string;
  phone: string;
}): Promise<{ tempPassword: string }> {
  const tempPassword = generateTemporaryPassword();
  const passwordHash = hashRegistrationPassword(
    tempPassword,
    appConfig.auth.registrationPasswordKey || 'unsafe-local-key'
  );

  await ddb.send(
    new PutCommand({
      TableName: tableConfig.users,
      Item: {
        pk: `USER#${input.customerId}`,
        sk: `USER#${input.customerId}`,
        email: input.email.toLowerCase(),
        phone: input.phone,
        passwordHash,
        passwordType: 'temporary',
        createdAt: new Date().toISOString(),
      },
    })
  );

  return { tempPassword };
}
