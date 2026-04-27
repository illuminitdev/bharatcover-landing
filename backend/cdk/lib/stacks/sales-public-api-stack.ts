import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import type { Construct } from 'constructs';
import { ApiStackBase, type ApiStackBaseProps } from '../shared/api-stack-base';
import { mountPaymentEndpoints } from './standalone-payment-api-stack';
import { tableConfig, appConfig } from '../../../shared/config';

export class SalesPublicApiStack extends ApiStackBase {
  constructor(scope: Construct, id: string, props: ApiStackBaseProps) {
    super(scope, id, props);

    const env = {
      STAGE: props.stage,
      REGION: appConfig.region,
      USERS_TABLE: tableConfig.users,
      CUSTOMERS_TABLE: tableConfig.customers,
      PRODUCTS_TABLE: tableConfig.products,
      POLICIES_TABLE: tableConfig.policies,
      PAYMENTS_TABLE: tableConfig.payments,
      NOTIFICATIONS_TABLE: tableConfig.notifications,
      SUBSCRIPTIONS_TABLE: tableConfig.subscriptions,
      ALLOWED_SALES_ORIGINS: props.allowedSalesOrigins.join(','),
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ?? '',
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ?? '',
      RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET ?? '',
      REGISTRATION_PASSWORD_ENCRYPTION_KEY:
        process.env.REGISTRATION_PASSWORD_ENCRYPTION_KEY ?? '',
    };

    const createSession = this.createLambda(
      'CreateSalesCheckoutSessionFn',
      'lambdas/sales/create-sales-checkout-session.ts',
      env
    );
    const updateSession = this.createLambda(
      'UpdateSalesCheckoutSessionFn',
      'lambdas/sales/update-sales-checkout-session.ts',
      env
    );
    const createOrder = this.createLambda(
      'CreateSalesPolicyOrderFn',
      'lambdas/sales/create-sales-policy-order.ts',
      env
    );
    const verifyPayment = this.createLambda(
      'VerifySalesPolicyPaymentFn',
      'lambdas/sales/verify-sales-policy-payment.ts',
      env
    );
    const finalizeAccount = this.createLambda(
      'FinalizeSalesCustomerAccountFn',
      'lambdas/sales/finalize-sales-customer-account.ts',
      env
    );

    const tableArns = [
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.users}`,
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.customers}`,
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.products}`,
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.policies}`,
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.payments}`,
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.notifications}`,
      `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableConfig.subscriptions}`,
    ];
    this.allowReadWrite(createSession, tableArns);
    this.allowReadWrite(updateSession, tableArns);
    this.allowReadWrite(createOrder, tableArns);
    this.allowReadWrite(verifyPayment, tableArns);
    this.allowReadWrite(finalizeAccount, tableArns);

    const api = new apigateway.RestApi(this, 'SalesPublicApi', {
      restApiName: `sales-public-api-${props.stage}`,
      deployOptions: { stageName: props.stage },
      defaultCorsPreflightOptions: {
        allowOrigins: props.allowedSalesOrigins.length
          ? props.allowedSalesOrigins
          : apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    const checkout = api.root.addResource('checkout');
    const sessions = checkout.addResource('sessions');
    sessions.addMethod('POST', new apigateway.LambdaIntegration(createSession));
    sessions.addMethod('PATCH', new apigateway.LambdaIntegration(updateSession));

    mountPaymentEndpoints(api, createOrder, verifyPayment);

    const finalize = checkout.addResource('finalize-account');
    finalize.addMethod('POST', new apigateway.LambdaIntegration(finalizeAccount));

    new cdk.CfnOutput(this, 'SalesPublicApiUrl', { value: api.url });
  }
}
