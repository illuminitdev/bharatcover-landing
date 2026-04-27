import {
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { appConfig } from '../config';

const cognito = new CognitoIdentityProviderClient({ region: appConfig.region });

export async function createCognitoUser(email: string, tempPassword: string): Promise<void> {
  if (!appConfig.auth.userPoolId) throw new Error('USER_POOL_ID is missing');
  await cognito.send(
    new AdminCreateUserCommand({
      UserPoolId: appConfig.auth.userPoolId,
      Username: email.toLowerCase(),
      MessageAction: 'SUPPRESS',
      UserAttributes: [{ Name: 'email', Value: email.toLowerCase() }],
      TemporaryPassword: tempPassword,
    })
  );
}

export async function setPermanentPassword(email: string, password: string): Promise<void> {
  if (!appConfig.auth.userPoolId) throw new Error('USER_POOL_ID is missing');
  await cognito.send(
    new AdminSetUserPasswordCommand({
      UserPoolId: appConfig.auth.userPoolId,
      Username: email.toLowerCase(),
      Password: password,
      Permanent: true,
    })
  );
}

export async function adminLogin(email: string, password: string) {
  if (!appConfig.auth.userPoolId || !appConfig.auth.clientId) {
    throw new Error('Cognito config missing');
  }
  return cognito.send(
    new AdminInitiateAuthCommand({
      UserPoolId: appConfig.auth.userPoolId,
      ClientId: appConfig.auth.clientId,
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      AuthParameters: { USERNAME: email.toLowerCase(), PASSWORD: password },
    })
  );
}

export async function login(email: string, password: string) {
  if (!appConfig.auth.clientId) throw new Error('CLIENT_ID is missing');
  return cognito.send(
    new InitiateAuthCommand({
      ClientId: appConfig.auth.clientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: { USERNAME: email.toLowerCase(), PASSWORD: password },
    })
  );
}

export async function refreshAuthToken(refreshToken: string) {
  if (!appConfig.auth.clientId) throw new Error('CLIENT_ID is missing');
  return cognito.send(
    new InitiateAuthCommand({
      ClientId: appConfig.auth.clientId,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: { REFRESH_TOKEN: refreshToken },
    })
  );
}
