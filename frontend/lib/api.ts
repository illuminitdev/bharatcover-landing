import { getInsuranceApiBase, type InsuranceApiService } from './insurance-api-config';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiRequestInit = Omit<RequestInit, 'method'> & {
  method?: ApiMethod;
  bearerToken?: string;
};

const ROUTE_SERVICE_RULES: Array<{ prefixes: string[]; service: InsuranceApiService }> = [
  { prefixes: ['/auth', '/users', '/me', '/referrals', '/society'], service: 'auth' },
  {
    prefixes: ['/leads', '/customers', '/agent', '/admin/hospitals', '/hospital'],
    service: 'customerSales',
  },
  { prefixes: ['/products', '/policies', '/dashboard'], service: 'policy' },
  { prefixes: ['/payments'], service: 'payment' },
  { prefixes: ['/companies', '/company', '/subscriptions', '/subscription-employees'], service: 'company' },
  { prefixes: ['/trusts'], service: 'trust' },
  { prefixes: ['/kyc', '/notifications'], service: 'kyc' },
];

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export function resolveServiceByPath(path: string): InsuranceApiService {
  const normalized = normalizePath(path);
  for (const rule of ROUTE_SERVICE_RULES) {
    if (rule.prefixes.some((prefix) => normalized.startsWith(prefix))) {
      return rule.service;
    }
  }
  return 'customerSales';
}

export function getApiBaseForPath(path: string): string {
  const service = resolveServiceByPath(path);
  return getInsuranceApiBase(service);
}

async function request(path: string, init: ApiRequestInit = {}): Promise<Response> {
  const urlPath = normalizePath(path);
  const base = getApiBaseForPath(urlPath);
  if (!base) {
    throw new Error(`Missing API base URL for path "${urlPath}"`);
  }

  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (init.bearerToken) {
    headers.set('Authorization', `Bearer ${init.bearerToken}`);
  }

  const { bearerToken: _token, method = 'GET', ...rest } = init;
  return fetch(`${base}${urlPath}`, { ...rest, method, headers });
}

export const api = {
  request,
  get(path: string, init: ApiRequestInit = {}) {
    return request(path, { ...init, method: 'GET' });
  },
  post(path: string, body?: unknown, init: ApiRequestInit = {}) {
    return request(path, { ...init, method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });
  },
  put(path: string, body?: unknown, init: ApiRequestInit = {}) {
    return request(path, { ...init, method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) });
  },
  patch(path: string, body?: unknown, init: ApiRequestInit = {}) {
    return request(path, { ...init, method: 'PATCH', body: body === undefined ? undefined : JSON.stringify(body) });
  },
  delete(path: string, init: ApiRequestInit = {}) {
    return request(path, { ...init, method: 'DELETE' });
  },
};
