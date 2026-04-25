import { createHmac, timingSafeEqual } from 'crypto';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { getDocClient } from '../common/dynamo';
import { json } from '../common/http';
import { ddbKey, pk } from '../common/keys';
import { getSsmSecret, razorpayWebhookSecretParam } from '../common/secrets';

/**
 * Canonical Razorpay webhook handler for this API.
 * Register exactly one webhook URL in Razorpay dashboard pointing here, or keep webhook on main API only.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' }, event);
  }

  const rawBody = event.body ?? '';
  const sigHeader =
    event.headers['X-Razorpay-Signature'] ??
    event.headers['x-razorpay-signature'] ??
    '';

  const fromEnv = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  let webhookSecret: string;
  if (fromEnv) {
    webhookSecret = fromEnv;
  } else {
    try {
      webhookSecret = await getSsmSecret(razorpayWebhookSecretParam());
    } catch {
      return json(500, { error: 'Webhook secret not configured (set RAZORPAY_WEBHOOK_SECRET on Lambda or SSM razorpay-webhook-secret)' }, event);
    }
  }

  const expected = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(sigHeader, 'utf8');
  if (!sigHeader || a.length !== b.length || !timingSafeEqual(a, b)) {
    return json(400, { error: 'Invalid webhook signature' }, event);
  }

  let payload: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } } } };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return json(400, { error: 'Invalid JSON' }, event);
  }

  const paymentsTable = process.env.PAYMENTS_TABLE;
  if (!paymentsTable) {
    return json(500, { error: 'PAYMENTS_TABLE not configured' }, event);
  }

  const doc = getDocClient();
  const paymentEntity = payload.payload?.payment?.entity as
    | {
        order_id?: string;
        id?: string;
        notes?: Record<string, string>;
      }
    | undefined;
  const orderId = paymentEntity?.order_id;
  const paymentId = paymentEntity?.id;

  if (payload.event === 'payment.captured' && orderId && paymentId) {
    const policyIdGuess = paymentEntity?.notes?.policyId;
    if (policyIdGuess) {
      const now = Math.floor(Date.now() / 1000);
      await doc.send(
        new UpdateCommand({
          TableName: paymentsTable,
          Key: ddbKey(pk.policy(policyIdGuess), `PAYMENT#ORDER#${orderId}`),
          UpdateExpression: 'SET #st = :st, #pid = :pid, #ua = :ua, #wAt = :wAt',
          ExpressionAttributeNames: {
            '#st': 'paymentStatus',
            '#pid': 'razorpayPaymentId',
            '#ua': 'updatedAt',
            '#wAt': 'webhookCapturedAt',
          },
          ExpressionAttributeValues: {
            ':st': 'CAPTURED',
            ':pid': paymentId,
            ':ua': now,
            ':wAt': now,
          },
        })
      ).catch(() => undefined);

      // Policy `ISSUED`, certificate, and term dates are set by
      // `POST /guest/payments/verify` (HMAC) — keep that as the source of truth
      // for a live policy. Webhook = reconciliation + ops/SNS, not a substitute.
    }
  }

  return json(200, { received: true }, event);
};
