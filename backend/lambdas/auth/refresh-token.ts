import type { APIGatewayProxyHandler } from 'aws-lambda';
import { fail, ok } from '../../shared/utils/response';
import { refreshAuthToken } from '../../shared/auth/cognito-client';

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body ?? '{}') as { refreshToken?: string };
  if (!body.refreshToken) return fail('refreshToken is required', 400);

  const auth = await refreshAuthToken(body.refreshToken);
  return ok({
    accessToken: auth.AuthenticationResult?.AccessToken,
    idToken: auth.AuthenticationResult?.IdToken,
    refreshToken: body.refreshToken,
  });
};
