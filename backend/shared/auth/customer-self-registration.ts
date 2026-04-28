import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../db/dynamodb-client';
import { tableConfig, appConfig } from '../config';
import { generateTemporaryPassword, hashRegistrationPassword } from './registration-password-crypto';
import { createCognitoUser, setPermanentPassword } from './cognito-client';

/**
 * Provisions a customer login account after a successful policy payment:
 *  - Generates a temporary password.
 *  - Writes a hashed mirror to the DynamoDB `users` table (legacy session store).
 *  - Creates the Cognito user in the shared User Pool and sets the temp
 *    password as permanent so the customer can sign in to the main app
 *    (Personal/Organisation login at https://bharatcover-insurance.vercel.app/)
 *    immediately. Idempotent on retries: an existing Cognito user is reused
 *    and just has its password reset to the new temp value.
 */
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
  const email = input.email.toLowerCase();

  await ddb.send(
    new PutCommand({
      TableName: tableConfig.users,
      Item: {
        pk: `USER#${input.customerId}`,
        sk: `USER#${input.customerId}`,
        email,
        phone: input.phone,
        passwordHash,
        passwordType: 'temporary',
        createdAt: new Date().toISOString(),
      },
    })
  );

  await ensureCognitoCustomer(email, tempPassword);

  return { tempPassword };
}

async function ensureCognitoCustomer(email: string, tempPassword: string): Promise<void> {
  if (!appConfig.auth.userPoolId || !appConfig.auth.clientId) {
    // Cognito intentionally skipped (e.g. local dev without a pool). The
    // caller owns surfacing this gap; the DynamoDB row is still written.
    console.warn(
      '[customer-self-registration] USER_POOL_ID/CLIENT_ID not configured; skipping Cognito provisioning for',
      email
    );
    return;
  }

  try {
    await createCognitoUser(email, tempPassword);
  } catch (err) {
    const name = (err as { name?: string }).name;
    if (name !== 'UsernameExistsException') throw err;
  }
  await setPermanentPassword(email, tempPassword);
}
