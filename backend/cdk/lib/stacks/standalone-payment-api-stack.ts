import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import type * as lambda from 'aws-cdk-lib/aws-lambda';

export function mountPaymentEndpoints(api: apigateway.RestApi, createOrderFn: lambda.IFunction, verifyFn: lambda.IFunction) {
  const sales = api.root.addResource('sales');
  const order = sales.addResource('order');
  order.addMethod('POST', new apigateway.LambdaIntegration(createOrderFn));

  const verify = sales.addResource('verify');
  verify.addMethod('POST', new apigateway.LambdaIntegration(verifyFn));
}
