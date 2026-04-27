import { api } from '@/lib/api';
import { guestFetch } from '@/lib/guest-api';

export const policyService = {
  purchase(payload: Record<string, unknown>) {
    return api.post('/policies/purchase', payload);
  },
  listForUser(bearerToken: string) {
    return api.get('/policies', { bearerToken });
  },
  byId(policyId: string, bearerToken?: string) {
    return api.get(`/policies/${encodeURIComponent(policyId)}`, bearerToken ? { bearerToken } : {});
  },
  byIdForGuest(policyId: string, guestToken: string) {
    return guestFetch(`/guest/policies/${encodeURIComponent(policyId)}`, { guestToken });
  },
  byIdForSalesUser(policyId: string, bearerToken: string) {
    return fetch(`/api/sales/user/policy?policyId=${encodeURIComponent(policyId)}`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
  },
  startGuestKyc(policyId: string, guestToken: string) {
    return guestFetch(`/guest/policies/${encodeURIComponent(policyId)}/kyc`, {
      method: 'POST',
      guestToken,
      body: JSON.stringify({}),
    });
  },
  submitGuestKycResult(
    policyId: string,
    guestToken: string,
    payload: Record<string, unknown>
  ) {
    return guestFetch(`/guest/policies/${encodeURIComponent(policyId)}/kyc/result`, {
      method: 'POST',
      guestToken,
      body: JSON.stringify(payload),
    });
  },
};
