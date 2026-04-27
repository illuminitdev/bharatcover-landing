#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SalesPublicApiStack } from '../lib/stacks/sales-public-api-stack';
import { AuthApiStack } from '../lib/stacks/auth-api-stack';
import { appConfig } from '../../shared/config';

const app = new cdk.App();

new SalesPublicApiStack(app, `SalesPublicApi-${appConfig.stage}`, {
  stage: appConfig.stage,
  allowedSalesOrigins: appConfig.allowedSalesOrigins,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? appConfig.region,
  },
});

new AuthApiStack(app, `AuthApi-${appConfig.stage}`, {
  stage: appConfig.stage,
  allowedSalesOrigins: appConfig.allowedSalesOrigins,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? appConfig.region,
  },
});

app.synth();
