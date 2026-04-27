import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

const cache = new Map<string, string>();
const ssm = new SSMClient({});

export async function getSsmSecret(name: string): Promise<string> {
  if (cache.has(name)) return cache.get(name)!;
  const out = await ssm.send(
    new GetParameterCommand({ Name: name, WithDecryption: true })
  );
  const v = out.Parameter?.Value;
  if (!v) throw new Error(`SSM parameter empty or missing: ${name}`);
  cache.set(name, v);
  return v;
}

export function guestSessionSecretParam(): string {
  const p = process.env.GUEST_SESSION_SECRET_PARAM;
  if (!p) throw new Error('GUEST_SESSION_SECRET_PARAM is not set');
  return p;
}

export function razorpayKeyIdParam(): string {
  const p = process.env.RAZORPAY_KEY_ID_PARAM;
  if (!p) throw new Error('RAZORPAY_KEY_ID_PARAM is not set');
  return p;
}

export function razorpayKeySecretParam(): string {
  const p = process.env.RAZORPAY_KEY_SECRET_PARAM;
  if (!p) throw new Error('RAZORPAY_KEY_SECRET_PARAM is not set');
  return p;
}

export function razorpayWebhookSecretParam(): string {
  const p = process.env.RAZORPAY_WEBHOOK_SECRET_PARAM;
  if (!p) throw new Error('RAZORPAY_WEBHOOK_SECRET_PARAM is not set');
  return p;
}

export function surepassApiKeyParam(): string {
  const p = process.env.SUREPASS_API_KEY_PARAM;
  if (!p) throw new Error('SUREPASS_API_KEY_PARAM is not set');
  return p;
}
