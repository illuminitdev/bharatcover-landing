import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';
import { ApiStackBase, type ApiStackBaseProps } from '../shared/api-stack-base';
import { tableConfig, appConfig } from '../../../shared/config';

export class AuthApiStack extends ApiStackBase {
  constructor(scope: Construct, id: string, props: ApiStackBaseProps) {
    super(scope, id, props);

    const env = {
      STAGE: props.stage,
      REGION: appConfig.region,
      USERS_TABLE: tableConfig.users,
      CUSTOMERS_TABLE: tableConfig.customers,
      USER_POOL_ID: appConfig.auth.userPoolId,
      CLIENT_ID: appConfig.auth.clientId,
      POLICY_EMAIL_FROM: process.env.POLICY_EMAIL_FROM ?? 'noreply@bharatcover.net',
      USERS_EMAIL_GSI_NAME: process.env.USERS_EMAIL_GSI_NAME ?? 'email-index',
    };

    const registerOtpFn = this.createLambda(
      'RegisterCustomerOtpFn',
      'lambdas/auth/register-customer-otp.ts',
      env
    );
    const registerVerifyFn = this.createLambda(
      'RegisterVerifyCustomerOtpFn',
      'lambdas/auth/register-verify-customer-otp.ts',
      env
    );
    const loginFn = this.createLambda('AuthLoginFn', 'lambdas/auth/login.ts', env);
    const refreshTokenFn = this.createLambda('AuthRefreshTokenFn', 'lambdas/auth/refresh-token.ts', env);

    const tableArns = [
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.users}`,
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.customers}`,
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.users}/index/*`,
    ];
    this.allowReadWrite(registerOtpFn, tableArns);
    this.allowReadWrite(registerVerifyFn, tableArns);

    for (const fn of [registerOtpFn, registerVerifyFn, loginFn, refreshTokenFn]) {
      fn.addToRolePolicy(
        new iam.PolicyStatement({
          actions: [
            'cognito-idp:AdminCreateUser',
            'cognito-idp:AdminSetUserPassword',
            'cognito-idp:AdminInitiateAuth',
            'cognito-idp:InitiateAuth',
          ],
          resources: ['*'],
        })
      );
      fn.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['ses:SendEmail', 'ses:SendRawEmail'],
          resources: ['*'],
        })
      );
    }

    const api = new apigateway.RestApi(this, 'AuthApi', {
      restApiName: `auth-api-${props.stage}`,
      deployOptions: { stageName: props.stage },
      defaultCorsPreflightOptions: {
        allowOrigins: props.allowedSalesOrigins.length
          ? props.allowedSalesOrigins
          : apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    const auth = api.root.addResource('auth');
    auth.addResource('register-customer-otp').addMethod('POST', new apigateway.LambdaIntegration(registerOtpFn));
    auth
      .addResource('register-verify-customer-otp')
      .addMethod('POST', new apigateway.LambdaIntegration(registerVerifyFn));
    auth.addResource('login').addMethod('POST', new apigateway.LambdaIntegration(loginFn));
    auth.addResource('refresh-token').addMethod('POST', new apigateway.LambdaIntegration(refreshTokenFn));

    new cdk.CfnOutput(this, 'AuthApiUrl', { value: api.url });
  }
}
