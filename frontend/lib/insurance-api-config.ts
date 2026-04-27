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
  | 'trust'
  | 'employee';

const SERVICE_ENV: Record<InsuranceApiService, keyof NodeJS.ProcessEnv> = {
  auth: 'NEXT_PUBLIC_AUTH_API_URL',
  customerSales: 'NEXT_PUBLIC_CUSTOMER_SALES_API_URL',
  policy: 'NEXT_PUBLIC_POLICY_API_URL',
  company: 'NEXT_PUBLIC_COMPANY_API_URL',
  kyc: 'NEXT_PUBLIC_KYC_API_URL',
  payment: 'NEXT_PUBLIC_PAYMENT_API_URL',
  trust: 'NEXT_PUBLIC_TRUST_API_URL',
  employee: 'NEXT_PUBLIC_EMPLOYEE_API_URL',
};

/** Strip trailing slashes so `${base}/v1/foo` works whether or not .env had a `/`. */
export function normalizeApiBase(raw: string | undefined): string {
  return (raw ?? '').replace(/\/+$/, '');
}

export function getInsuranceApiBase(service: InsuranceApiService): string {
  const base = normalizeApiBase(process.env[SERVICE_ENV[service]] as string | undefined);
  validateApiBaseForStage(base, String(SERVICE_ENV[service]));
  return base;
}

type BackendStage = 'raghu-development' | 'production';

function getBackendStage(): BackendStage {
  const raw = (process.env.NEXT_PUBLIC_BACKEND_STAGE ?? 'raghu-development').trim();
  return raw === 'production' ? 'production' : 'raghu-development';
}

function validateApiBaseForStage(base: string, envName: string): void {
  if (!base) return;
  const stage = getBackendStage();
  const lowered = base.toLowerCase();

  // Guardrail: when production is active, never allow explicit non-prod stage token.
  if (stage === 'production' && lowered.includes('raghu-development')) {
    throw new Error(`${envName} has raghu-development URL while NEXT_PUBLIC_BACKEND_STAGE=production`);
  }

  // Guardrail: when raghu-development is active and URL has stage token, it must match.
  if (
    stage === 'raghu-development' &&
    (lowered.includes('/production') || lowered.includes('://production.') || lowered.includes('-production'))
  ) {
    throw new Error(`${envName} appears to be production URL while NEXT_PUBLIC_BACKEND_STAGE=raghu-development`);
  }
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
