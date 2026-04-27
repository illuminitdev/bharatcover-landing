import { config as loadEnv } from 'dotenv';

loadEnv();

export const STAGES = ['raghu-development', 'production'] as const;
export type Stage = (typeof STAGES)[number];

function assertStage(value: string | undefined, field: string): Stage {
  const stage = value ?? 'raghu-development';
  if (!STAGES.includes(stage as Stage)) {
    throw new Error(`Invalid ${field} "${stage}". Allowed: raghu-development, production`);
  }
  return stage as Stage;
}

export interface Config {
  name: string;
  staging: string;
  aws: {
    accountId: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  cognito: {
    userPoolId?: string;
    clientId?: string;
  };
  razorpay: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  };
  whatsapp: {
    apiUrl: string;
    apiKey: string;
  };
  kyc: {
    apiUrl: string;
    apiKey: string;
  };
  surepass: {
    apiUrl: string;
    apiKey: string;
    environment: 'sandbox' | 'production';
  };
}

const env = assertStage(process.env.NODE_ENV, 'NODE_ENV');
const staging = assertStage(process.env.STAGE, 'STAGE');

export const config: Config = {
  name: process.env.SERVICE_NAME || 'insurance-platform',
  staging,
  aws: {
    accountId: process.env.AWS_ACCOUNT_ID || '288761766237',
    region: process.env.REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  cognito: {
    userPoolId: process.env.USER_POOL_ID,
    clientId: process.env.CLIENT_ID,
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || '',
    apiKey: process.env.WHATSAPP_API_KEY || '',
  },
  kyc: {
    apiUrl: process.env.KYC_API_URL || '',
    apiKey: process.env.KYC_API_KEY || '',
  },
  surepass: {
    apiUrl: process.env.SUREPASS_API_URL || 'https://sandbox.surepass.app',
    apiKey: process.env.SUREPASS_API_KEY || '',
    environment: (process.env.SUREPASS_ENV as 'sandbox' | 'production') || 'sandbox',
  },
};

export function getServiceName(service: string): string {
  return `${config.name}-${service}-${config.staging}`;
}

export function getTableName(tableName: string): string {
  return getServiceName(tableName);
}

// Compatibility exports for existing backend code.
export const appConfig = {
  env,
  stage: staging,
  region: config.aws.region,
  serviceName: config.name,
  allowedSalesOrigins: (process.env.ALLOWED_SALES_ORIGINS ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean),
  razorpay: config.razorpay,
  auth: {
    userPoolId: config.cognito.userPoolId ?? '',
    clientId: config.cognito.clientId ?? '',
    registrationPasswordKey: process.env.REGISTRATION_PASSWORD_ENCRYPTION_KEY ?? '',
  },
};

function table(entity: string): string {
  return `${appConfig.serviceName}-${entity}-${appConfig.stage}`;
}

export const tableConfig = {
  users: process.env.USERS_TABLE ?? table('users'),
  customers: process.env.CUSTOMERS_TABLE ?? table('customers'),
  products: process.env.PRODUCTS_TABLE ?? table('products'),
  policies: process.env.POLICIES_TABLE ?? table('policies'),
  payments: process.env.PAYMENTS_TABLE ?? table('payments'),
  notifications: process.env.NOTIFICATIONS_TABLE ?? table('notifications'),
  subscriptions: process.env.SUBSCRIPTIONS_TABLE ?? table('subscriptions'),
};

export default config;
