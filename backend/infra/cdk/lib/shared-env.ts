/** Table naming aligned with insurance-platform main backend: insurance-platform-<entity>-<STAGE> */
export function tableName(stage: string, entity: string): string {
  return `insurance-platform-${entity}-${stage}`;
}

export const TABLE_ENTITIES = [
  'users',
  'customers',
  'products',
  'policies',
  'payments',
  'kyc-records',
  'subscriptions',
] as const;

export type TableEntity = (typeof TABLE_ENTITIES)[number];

export interface LandingTableEnv {
  STAGE: string;
  USERS_TABLE: string;
  CUSTOMERS_TABLE: string;
  PRODUCTS_TABLE: string;
  POLICIES_TABLE: string;
  PAYMENTS_TABLE: string;
  KYC_RECORDS_TABLE: string;
  SUBSCRIPTIONS_TABLE: string;
}

export function buildTableEnv(stage: string): LandingTableEnv {
  return {
    STAGE: stage,
    USERS_TABLE: tableName(stage, 'users'),
    CUSTOMERS_TABLE: tableName(stage, 'customers'),
    PRODUCTS_TABLE: tableName(stage, 'products'),
    POLICIES_TABLE: tableName(stage, 'policies'),
    PAYMENTS_TABLE: tableName(stage, 'payments'),
    KYC_RECORDS_TABLE: tableName(stage, 'kyc-records'),
    SUBSCRIPTIONS_TABLE: tableName(stage, 'subscriptions'),
  };
}

/** SSM parameter prefix for landing API secrets (create in AWS before deploy). */
export function ssmPrefix(stage: string): string {
  return `/bharatcover/landing/${stage}`;
}
