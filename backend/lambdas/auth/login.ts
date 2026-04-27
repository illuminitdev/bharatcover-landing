import type { APIGatewayProxyHandler } from 'aws-lambda';
import { fail, ok } from '../../shared/utils/response';
import { login } from '../../shared/auth/cognito-client';

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body ?? '{}') as { email?: string; password?: string };
  if (!body.email || !body.password) return fail('email and password are required', 400);

  const auth = await login(body.email, body.password);
  return ok({
    accessToken: auth.AuthenticationResult?.AccessToken,
    refreshToken: auth.AuthenticationResult?.RefreshToken,
    idToken: auth.AuthenticationResult?.IdToken,
  });
};
