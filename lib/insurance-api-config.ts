/**
 * BharatCover / insurance-platform API Gateway bases (split by domain).
 * Paths are usually under `/v1/...` — confirm with each service’s OpenAPI before calling.
 */

export type InsuranceApiService =
  | 'auth'
  | 'customerSales'
  | 'policy'
  | 'company'
  | 'kyc'
  | 'payment'
  | 'trust';

const SERVICE_ENV: Record<InsuranceApiService, keyof NodeJS.ProcessEnv> = {
  auth: 'NEXT_PUBLIC_AUTH_API_URL',
  customerSales: 'NEXT_PUBLIC_CUSTOMER_SALES_API_URL',
  policy: 'NEXT_PUBLIC_POLICY_API_URL',
  company: 'NEXT_PUBLIC_COMPANY_API_URL',
  kyc: 'NEXT_PUBLIC_KYC_API_URL',
  payment: 'NEXT_PUBLIC_PAYMENT_API_URL',
  trust: 'NEXT_PUBLIC_TRUST_API_URL',
};

/** Strip trailing slashes so `${base}/v1/foo` works whether or not .env had a `/`. */
export function normalizeApiBase(raw: string | undefined): string {
  return (raw ?? '').replace(/\/+$/, '');
}

export function getInsuranceApiBase(service: InsuranceApiService): string {
  return normalizeApiBase(process.env[SERVICE_ENV[service]] as string | undefined);
}

/** CloudFront or CDN hostname only (no scheme). */
export function getCdnDomain(): string {
  return (process.env.NEXT_PUBLIC_CDN_DOMAIN ?? '').replace(/\/+$/, '');
}

export function cdnUrl(path: string): string {
  const host = getCdnDomain();
  if (!host) return path.startsWith('/') ? path : `/${path}`;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `https://${host}${p}`;
}
