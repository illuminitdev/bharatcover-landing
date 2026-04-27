import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import type { Construct } from 'constructs';
import { defaultNodeBundling } from './cdk-docker-bundling';

export interface ApiStackBaseProps extends cdk.StackProps {
  stage: 'raghu-development' | 'production';
  allowedSalesOrigins: string[];
}

export class ApiStackBase extends cdk.Stack {
  protected createLambda(scopeId: string, relativeEntry: string, environment: Record<string, string>) {
    return new nodejs.NodejsFunction(this, scopeId, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../../', relativeEntry),
      timeout: cdk.Duration.seconds(20),
      memorySize: 256,
      environment,
      bundling: defaultNodeBundling(),
    });
  }

  protected allowReadWrite(fn: lambda.Function, tableArns: string[]) {
    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:Query'],
        resources: tableArns,
      })
    );
  }
}
