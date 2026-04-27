import axios, { AxiosInstance } from 'axios';

type TokenProvider = () => string | null;

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
};

export function createApi(baseURL: string, getToken?: TokenProvider): AxiosInstance {
  const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
}

function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function unwrap<T>(value: T | ApiEnvelope<T>): T {
  if (value && typeof value === 'object' && 'data' in (value as ApiEnvelope<T>)) {
    return ((value as ApiEnvelope<T>).data ?? value) as T;
  }
  return value as T;
}

export const authApi = createApi(requireEnv('NEXT_PUBLIC_AUTH_API_URL'));
export const customerSalesApi = createApi(
  requireEnv('NEXT_PUBLIC_CUSTOMER_SALES_API_URL'),
  getAccessToken
);
export const paymentApi = createApi(requireEnv('NEXT_PUBLIC_PAYMENT_API_URL'), getAccessToken);
export const kycApi = createApi(requireEnv('NEXT_PUBLIC_KYC_API_URL'), getAccessToken);

export async function completeCustomerPolicy(payload: {
  customerId: string;
  productId: string;
  kycTransactionId: string;
  personalDetails: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  nominee: {
    name: string;
    relation: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
  };
  familyMembers?: Array<{
    id?: string;
    name: string;
    relation: string;
    dateOfBirth: string;
    gender: string;
  }>;
  paymentMode?: 'FULL' | 'EMI';
  paymentMethod?: 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET';
  emiTenure?: number;
}) {
  const { data } = await customerSalesApi.post('/agent/customers/complete-policy', payload);
  return unwrap(data);
}

export async function loginCustomer(email: string, password: string): Promise<Tokens> {
  const { data } = await authApi.post('/auth/login', { email, password });
  return unwrap(data);
}

export async function getMe() {
  const { data } = await authApi.get('/me');
  return unwrap(data);
}

export async function createPolicyOrder(policyId: string) {
  const { data } = await paymentApi.post('/payments/create-policy-order', { policyId });
  return unwrap(data);
}

export async function verifyPolicyPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  policyId: string;
  paymentId: string;
}) {
  const { data } = await paymentApi.post('/payments/verify-policy-payment', payload);
  return unwrap(data);
}

export async function generatePaymentLink(policyId: string) {
  const { data } = await paymentApi.get(`/payments/generate-link/${policyId}`);
  return unwrap(data);
}

export async function initializeDigilocker(consent: boolean, customerDetails?: unknown) {
  const { data } = await kycApi.post('/kyc/digilocker/initialize', {
    consent,
    customerDetails,
  });
  return unwrap(data);
}

export async function completeDigilocker(transactionId: string, clientId: string) {
  const { data } = await kycApi.post('/kyc/digilocker/complete', { transactionId, clientId });
  return unwrap(data);
}

export async function getCustomerKyc(customerId: string) {
  const { data } = await kycApi.get(`/kyc/customer/${customerId}`);
  return unwrap(data);
}

