import type { BundlingOptions } from 'aws-cdk-lib/aws-lambda-nodejs';

export function defaultNodeBundling(): BundlingOptions {
  return {
    minify: true,
    sourceMap: true,
    target: 'node20',
    externalModules: ['@aws-sdk/*'],
  };
}
