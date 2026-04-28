#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LandingPublicApiStack } from '../lib/landing-public-api-stack';

const app = new cdk.App();

const stage = (app.node.tryGetContext('stage') as string) ?? process.env.STAGE ?? 'development';
const allowedOrigins =
  (app.node.tryGetContext('allowedOrigins') as string) ??
  process.env.ALLOWED_ORIGINS ??
  '*';

new LandingPublicApiStack(app, `LandingPublicApi-${stage}`, {
  stage,
  allowedOrigins,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'ap-south-1',
  },
  description: 'Guest landing funnel API (shared DynamoDB with insurance-platform)',
});

app.synth();
