import type { InsuranceApiService } from './insurance-api-config';
import { getInsuranceApiBase } from './insurance-api-config';

export type PlatformFetchInit = RequestInit & {
  /** Forwarded as Authorization when set */
  bearerToken?: string;
};

/**
 * Fetch against a split insurance-platform API (NEXT_PUBLIC_*_API_URL).
 * Example: `platformFetch('policy', '/v1/policies/me', { bearerToken: token })`
 */
export async function platformFetch(
  service: InsuranceApiService,
  path: string,
  init: PlatformFetchInit = {}
): Promise<Response> {
  const base = getInsuranceApiBase(service);
  if (!base) {
    throw new Error(`Missing env for ${service} (see lib/insurance-api-config.ts)`);
  }
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (init.bearerToken) {
    headers.set('Authorization', `Bearer ${init.bearerToken}`);
  }
  const { bearerToken: _b, ...rest } = init;
  const urlPath = path.startsWith('/') ? path : `/${path}`;
  return fetch(`${base}${urlPath}`, { ...rest, headers });
}
