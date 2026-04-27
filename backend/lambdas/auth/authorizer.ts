import type { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import { fail } from '../../shared/utils/response';
import { verifyPublicSessionToken } from '../../shared/utils/authorizer';

export const handler: APIGatewayTokenAuthorizerHandler = async (event) => {
  const token = event.authorizationToken?.replace(/^Bearer\s+/i, '');
  const parsed = token ? verifyPublicSessionToken(token) : null;
  if (!parsed) {
    return {
      principalId: 'anonymous',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{ Action: 'execute-api:Invoke', Effect: 'Deny', Resource: event.methodArn }],
      },
      context: { reason: fail('Unauthorized', 401).body },
    };
  }

  return {
    principalId: parsed.sessionId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{ Action: 'execute-api:Invoke', Effect: 'Allow', Resource: event.methodArn }],
    },
    context: { sessionId: parsed.sessionId },
  };
};
