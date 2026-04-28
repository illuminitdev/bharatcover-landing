import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

/**
 * Server-side Cognito provisioning used by Next.js API routes that issue
 * post-payment credentials (e.g. /api/checkout/complete). Mirrors the
 * lambdas in `backend/shared/auth/cognito-client.ts` so the shared User Pool
 * always has a working login row by the time the customer is redirected to
 * the main BharatCover app.
 */
const region =
  process.env.AWS_REGION ||
  process.env.NEXT_PUBLIC_AWS_REGION ||
  'us-east-1';

const client = new CognitoIdentityProviderClient({ region });

function getUserPoolId(): string | null {
  return (
    process.env.COGNITO_USER_POOL_ID ||
    process.env.NEXT_PUBLIC_USER_POOL_ID ||
    null
  );
}

export function isCognitoAdminConfigured(): boolean {
  return Boolean(
    getUserPoolId() &&
      (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_LAMBDA_FUNCTION_NAME)
  );
}

/**
 * Idempotently provisions a customer in the shared Cognito User Pool with
 * the given temporary password set as permanent. Safe to call on retries.
 */
export async function ensureCognitoCustomer(
  rawEmail: string,
  password: string
): Promise<{ provisioned: boolean; reason?: string }> {
  const userPoolId = getUserPoolId();
  if (!userPoolId) {
    return { provisioned: false, reason: 'USER_POOL_ID is not configured' };
  }
  const email = rawEmail.trim().toLowerCase();
  if (!email) return { provisioned: false, reason: 'email is empty' };

  try {
    await client.send(
      new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: email,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
        ],
        TemporaryPassword: password,
      })
    );
  } catch (err) {
    const name = (err as { name?: string }).name;
    if (name !== 'UsernameExistsException') {
      return {
        provisioned: false,
        reason: err instanceof Error ? err.message : 'AdminCreateUser failed',
      };
    }
  }

  try {
    await client.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: userPoolId,
        Username: email,
        Password: password,
        Permanent: true,
      })
    );
  } catch (err) {
    return {
      provisioned: false,
      reason: err instanceof Error ? err.message : 'AdminSetUserPassword failed',
    };
  }

  return { provisioned: true };
}
