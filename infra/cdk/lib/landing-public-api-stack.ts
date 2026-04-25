import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import type { Construct } from 'constructs';
import * as path from 'path';
import { buildTableEnv, ssmPrefix } from './shared-env';

export interface LandingPublicApiStackProps extends cdk.StackProps {
  stage: string;
  /** Comma-separated origins for CORS + Lambda responses */
  allowedOrigins: string;
}

export class LandingPublicApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LandingPublicApiStackProps) {
    super(scope, id, props);

    const { stage, allowedOrigins } = props;
    const tables = buildTableEnv(stage);
    const ssmBase = ssmPrefix(stage);

    const customersTable = dynamodb.Table.fromTableName(
      this,
      'CustomersTable',
      tables.CUSTOMERS_TABLE
    );
    const usersTable = dynamodb.Table.fromTableName(this, 'UsersTable', tables.USERS_TABLE);
    const productsTable = dynamodb.Table.fromTableName(
      this,
      'ProductsTable',
      tables.PRODUCTS_TABLE
    );
    const policiesTable = dynamodb.Table.fromTableName(
      this,
      'PoliciesTable',
      tables.POLICIES_TABLE
    );
    const paymentsTable = dynamodb.Table.fromTableName(
      this,
      'PaymentsTable',
      tables.PAYMENTS_TABLE
    );
    const kycTable = dynamodb.Table.fromTableName(this, 'KycTable', tables.KYC_RECORDS_TABLE);
    const commonEnv = {
      ...tables,
      ALLOWED_ORIGINS: allowedOrigins,
      GUEST_SESSION_SECRET_PARAM: `${ssmBase}/guest-session-hmac-secret`,
      RAZORPAY_KEY_ID_PARAM: `${ssmBase}/razorpay-key-id`,
      RAZORPAY_KEY_SECRET_PARAM: `${ssmBase}/razorpay-key-secret`,
      RAZORPAY_WEBHOOK_SECRET_PARAM: `${ssmBase}/razorpay-webhook-secret`,
      SUREPASS_API_KEY_PARAM: `${ssmBase}/surepass-api-key`,
      SUREPASS_API_URL: process.env.SUREPASS_API_URL ?? 'https://sandbox.surepass.app',
      SUREPASS_ENV: process.env.SUREPASS_ENV ?? 'sandbox',
    };

    const ssmPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ssm:GetParameter'],
      resources: [
        `arn:aws:ssm:${this.region}:${this.account}:parameter${ssmBase}/*`,
      ],
    });

    const lambdaDir = path.join(__dirname, '../lambda');

    const productsFn = new nodejs.NodejsFunction(this, 'ProductsFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(lambdaDir, 'products/index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
      environment: commonEnv,
      bundling: { minify: true, sourceMap: true },
    });
    productsTable.grantReadData(productsFn);

    const guestSessionsFn = new nodejs.NodejsFunction(this, 'GuestSessionsFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(lambdaDir, 'guest-sessions/index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
      environment: commonEnv,
      bundling: { minify: true, sourceMap: true },
    });
    customersTable.grantReadWriteData(guestSessionsFn);
    policiesTable.grantReadWriteData(guestSessionsFn);

    const guestPoliciesFn = new nodejs.NodejsFunction(this, 'GuestPoliciesFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(lambdaDir, 'guest-policies/index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
      environment: commonEnv,
      bundling: { minify: true, sourceMap: true },
    });
    policiesTable.grantReadWriteData(guestPoliciesFn);

    const kycFn = new nodejs.NodejsFunction(this, 'KycFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(lambdaDir, 'kyc/index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      environment: commonEnv,
      bundling: { minify: true, sourceMap: true },
    });
    policiesTable.grantReadWriteData(kycFn);
    kycTable.grantReadWriteData(kycFn);

    /** Optional: set at `cdk deploy` time so PaymentsFn can call Razorpay without editing SSM. */
    const paymentsEnv: Record<string, string> = { ...commonEnv };
    if (process.env.LANDING_RAZORPAY_KEY_ID && process.env.LANDING_RAZORPAY_KEY_SECRET) {
      paymentsEnv.RAZORPAY_KEY_ID = process.env.LANDING_RAZORPAY_KEY_ID;
      paymentsEnv.RAZORPAY_KEY_SECRET = process.env.LANDING_RAZORPAY_KEY_SECRET;
    }
    if (process.env.LANDING_POLICY_EMAIL_FROM) {
      paymentsEnv.POLICY_EMAIL_FROM = process.env.LANDING_POLICY_EMAIL_FROM;
    }

    const paymentsFn = new nodejs.NodejsFunction(this, 'PaymentsFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(lambdaDir, 'payments/index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      environment: paymentsEnv,
      bundling: { minify: true, sourceMap: true },
    });
    policiesTable.grantReadWriteData(paymentsFn);
    paymentsTable.grantReadWriteData(paymentsFn);
    productsTable.grantReadData(paymentsFn);
    customersTable.grantReadData(paymentsFn);
    usersTable.grantReadWriteData(paymentsFn);
    paymentsFn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      })
    );

    const webhookEnv: Record<string, string> = { ...commonEnv };
    if (process.env.LANDING_RAZORPAY_WEBHOOK_SECRET) {
      webhookEnv.RAZORPAY_WEBHOOK_SECRET = process.env.LANDING_RAZORPAY_WEBHOOK_SECRET;
    }

    const webhookFn = new nodejs.NodejsFunction(this, 'RazorpayWebhookFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(lambdaDir, 'webhooks-razorpay/index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      environment: webhookEnv,
      bundling: { minify: true, sourceMap: true },
    });
    policiesTable.grantReadWriteData(webhookFn);
    paymentsTable.grantReadWriteData(webhookFn);

    const userAuthFn = new nodejs.NodejsFunction(this, 'UserAuthFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(lambdaDir, 'user-auth/index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      environment: commonEnv,
      bundling: { minify: true, sourceMap: true },
    });
    usersTable.grantReadData(userAuthFn);
    policiesTable.grantReadData(userAuthFn);

    for (const fn of [
      productsFn,
      guestSessionsFn,
      guestPoliciesFn,
      kycFn,
      paymentsFn,
      webhookFn,
      userAuthFn,
    ]) {
      fn.addToRolePolicy(ssmPolicy);
    }

    const origins = allowedOrigins.split(',').map((o) => o.trim()).filter(Boolean);

    const api = new apigateway.RestApi(this, 'LandingGuestApi', {
      restApiName: `landing-guest-api-${stage}`,
      description: 'Public guest funnel API for BharatCover landing',
      deployOptions: { stageName: stage },
      defaultCorsPreflightOptions: {
        allowOrigins: origins,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'X-Guest-Session'],
      },
    });

    const productsRes = api.root.addResource('products');
    productsRes.addMethod('GET', new apigateway.LambdaIntegration(productsFn));
    const productById = productsRes.addResource('{productId}');
    productById.addMethod('GET', new apigateway.LambdaIntegration(productsFn));

    const guest = api.root.addResource('guest');
    const sessions = guest.addResource('sessions');
    sessions.addMethod('POST', new apigateway.LambdaIntegration(guestSessionsFn));
    const sessionById = sessions.addResource('{sessionId}');
    sessionById.addMethod('GET', new apigateway.LambdaIntegration(guestSessionsFn));

    const policies = guest.addResource('policies');
    const policyById = policies.addResource('{policyId}');
    policyById.addMethod('GET', new apigateway.LambdaIntegration(guestPoliciesFn));
    policyById.addMethod('PATCH', new apigateway.LambdaIntegration(guestPoliciesFn));
    const policyStatus = policyById.addResource('status');
    policyStatus.addMethod('PATCH', new apigateway.LambdaIntegration(guestPoliciesFn));

    const kyc = policyById.addResource('kyc');
    kyc.addMethod('POST', new apigateway.LambdaIntegration(kycFn));
    const kycResult = kyc.addResource('result');
    kycResult.addMethod('POST', new apigateway.LambdaIntegration(kycFn));

    const orders = policyById.addResource('payments').addResource('orders');
    orders.addMethod('POST', new apigateway.LambdaIntegration(paymentsFn));

    const payVerify = guest.addResource('payments').addResource('verify');
    payVerify.addMethod('POST', new apigateway.LambdaIntegration(paymentsFn));

    const webhooks = api.root.addResource('webhooks');
    const rzWh = webhooks.addResource('razorpay');
    rzWh.addMethod('POST', new apigateway.LambdaIntegration(webhookFn));

    const auth = api.root.addResource('auth');
    const authLogin = auth.addResource('login');
    authLogin.addMethod('POST', new apigateway.LambdaIntegration(userAuthFn));

    const user = api.root.addResource('user');
    const userPolicies = user.addResource('policies');
    userPolicies.addMethod('GET', new apigateway.LambdaIntegration(userAuthFn));
    const userPolicyById = userPolicies.addResource('{policyId}');
    userPolicyById.addMethod('GET', new apigateway.LambdaIntegration(userAuthFn));

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Invoke URL for landing guest API',
    });

    new cdk.CfnOutput(this, 'Stage', { value: stage });
  }
}
