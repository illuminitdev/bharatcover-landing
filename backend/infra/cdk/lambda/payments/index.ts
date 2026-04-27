import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { getDocClient } from '../common/dynamo';
import { bearerToken, verifyGuestToken } from '../common/guest-token';
import { json, parseJson } from '../common/http';
import { ddbKey, pk, sk } from '../common/keys';
import { getSsmSecret, guestSessionSecretParam, razorpayKeyIdParam, razorpayKeySecretParam } from '../common/secrets';

/** Base premium in paise (ex-GST) — aligns with products STATIC_CATALOG when Dynamo has no row. */
const STATIC_BASE_PREMIUM_PAISE: Record<string, number> = {
  'pa-lite': 2000,
  'pa-standard': 10000,
  'pa-10l': 20000,
  'pa-premium': 30000,
};

const sesClient = new SESv2Client({});

async function resolveRazorpayKeys(): Promise<{ keyId: string; keySecret: string }> {
  const id = process.env.RAZORPAY_KEY_ID?.trim();
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (id && secret) {
    return { keyId: id, keySecret: secret };
  }
  return {
    keyId: await getSsmSecret(razorpayKeyIdParam()),
    keySecret: await getSsmSecret(razorpayKeySecretParam()),
  };
}

const orderBody = z.object({
  currency: z.string().default('INR'),
  notes: z.record(z.string()).optional(),
});

const verifyBody = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  policyId: z.string().uuid().optional(),
  paymentId: z.string().uuid().optional(),
});

/** Normalize policy term fields (platform may store as string). */
function asUnixSeconds(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && /^\d+$/.test(v.trim())) return parseInt(v.trim(), 10);
  return fallback;
}

async function authPolicy(event: APIGatewayProxyEvent, policyId: string) {
  const hdr = bearerToken(event);
  if (!hdr) return { error: json(401, { error: 'Missing guest token' }, event) };
  const secret = await getSsmSecret(guestSessionSecretParam());
  const payload = verifyGuestToken(hdr, secret);
  if (!payload || payload.policyId !== policyId) {
    return { error: json(403, { error: 'Invalid token' }, event) };
  }
  return { payload };
}

async function runVerifyPayment(
  event: APIGatewayProxyEvent,
  doc: DynamoDBDocumentClient,
  policiesTable: string,
  paymentsTable: string,
  customersTable: string,
  usersTable: string
): Promise<APIGatewayProxyResult> {
  const body = parseJson<unknown>(event);
  const parsed = verifyBody.safeParse(body);
  if (!parsed.success) {
    return json(400, { error: 'Invalid body', details: parsed.error.flatten() }, event);
  }
  const hdr = bearerToken(event);
  if (!hdr) {
    return json(401, { error: 'Guest session token required for verify' }, event);
  }
  let guestSecret: string;
  try {
    guestSecret = await getSsmSecret(guestSessionSecretParam());
  } catch (e) {
    console.error('payments verify guest SSM', e);
    return json(500, { error: 'Guest auth misconfigured', message: e instanceof Error ? e.message : String(e) }, event);
  }
  const guestPayload = verifyGuestToken(hdr, guestSecret);
  if (!guestPayload) {
    return json(403, { error: 'Invalid guest token' }, event);
  }

  let keySecret: string;
  try {
    const keys = await resolveRazorpayKeys();
    keySecret = keys.keySecret;
  } catch (e) {
    console.error('payments verify Razorpay keys', e);
    return json(500, { error: 'Razorpay keys not configured (SSM or Lambda env)' }, event);
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, policyId, paymentId } = parsed.data;
  const expected = createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(razorpay_signature, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return json(400, { error: 'Invalid payment signature' }, event);
  }

  if (policyId && policyId !== guestPayload.policyId) {
    return json(403, { error: 'policyId does not match guest session' }, event);
  }

  const policyIdResolved = guestPayload.policyId;
  const pay = await doc.send(
    new GetCommand({
      TableName: paymentsTable,
      Key: ddbKey(pk.policy(policyIdResolved), `PAYMENT#ORDER#${razorpay_order_id}`),
    })
  );
  if (!pay.Item) {
    return json(404, { error: 'Order not found for this session' }, event);
  }
  if (paymentId && pay.Item.paymentId && pay.Item.paymentId !== paymentId) {
    return json(403, { error: 'paymentId does not match stored order' }, event);
  }

  const policyGet = await doc.send(
    new GetCommand({
      TableName: policiesTable,
      Key: ddbKey(pk.policy(policyIdResolved), sk.metadata),
    })
  );
  if (!policyGet.Item) {
    return json(404, { error: 'Policy not found' }, event);
  }
  const customerId = String(policyGet.Item.customerId ?? '');
  let customerEmail = '';
  let customerPhone = '';
  if (customerId) {
    const customerGet = await doc.send(
      new GetCommand({
        TableName: customersTable,
        Key: ddbKey(pk.customer(customerId), sk.metadata),
      })
    );
    customerEmail = String(customerGet.Item?.email ?? '').trim();
    customerPhone = String(customerGet.Item?.phone ?? '').trim();
  }

  const now = Math.floor(Date.now() / 1000);
  if (policyGet.Item.status === 'ISSUED' && pay.Item.paymentStatus === 'CAPTURED') {
    return json(
      200,
      {
        verified: true,
        idempotent: true,
        policyId: policyIdResolved,
        certificateNumber: policyGet.Item.certificateNumber as string | undefined,
      },
      event
    );
  }

  const oneYear = 365 * 24 * 60 * 60;
  const termStart = asUnixSeconds(policyGet.Item.termStart, now);
  const termEnd = asUnixSeconds(policyGet.Item.termEnd, now + oneYear);
  const certificateNumber =
    (policyGet.Item.certificateNumber as string | undefined) ||
    `BC-PA-${policyIdResolved.replace(/-/g, '').slice(0, 12).toUpperCase()}`;

  try {
    await doc.send(
      new UpdateCommand({
        TableName: paymentsTable,
        Key: ddbKey(pk.policy(policyIdResolved), `PAYMENT#ORDER#${razorpay_order_id}`),
        UpdateExpression: 'SET #st = :st, #pid = :pid, #vAt = :vAt, #ua = :ua',
        ExpressionAttributeNames: {
          '#st': 'paymentStatus',
          '#pid': 'razorpayPaymentId',
          '#vAt': 'verifiedAt',
          '#ua': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':st': 'CAPTURED',
          ':pid': razorpay_payment_id,
          ':vAt': now,
          ':ua': now,
        },
      })
    );
  } catch (e) {
    console.error('payments verify update payment row', e);
    return json(
      500,
      {
        error: 'Payment record update failed',
        message: e instanceof Error ? e.message : String(e),
        step: 'update_payment',
      },
      event
    );
  }

  try {
    await doc.send(
      new UpdateCommand({
        TableName: policiesTable,
        Key: ddbKey(pk.policy(policyIdResolved), sk.metadata),
        UpdateExpression:
          'SET #st = :st, #ua = :ua, #pcomp = :pcomp, #t0 = :t0, #t1 = :t1, #cert = :cert',
        ExpressionAttributeNames: {
          '#st': 'status',
          '#ua': 'updatedAt',
          '#pcomp': 'paymentCompletedAt',
          '#t0': 'termStart',
          '#t1': 'termEnd',
          '#cert': 'certificateNumber',
        },
        ExpressionAttributeValues: {
          ':st': 'ISSUED',
          ':ua': now,
          ':pcomp': now,
          ':t0': termStart,
          ':t1': termEnd,
          ':cert': certificateNumber,
        },
      })
    );
  } catch (e) {
    console.error('payments verify update policy row', e);
    return json(
      500,
      {
        error: 'Policy record update failed',
        message: e instanceof Error ? e.message : String(e),
        step: 'update_policy',
      },
      event
    );
  }

  function hashPassword(pwd: string): string {
    const salt = randomBytes(16);
    const hash = scryptSync(pwd, salt, 64) as Buffer;
    return `${salt.toString('base64')}:${hash.toString('base64')}`;
  }

  let generatedLogin: { email: string; tempPassword: string } | null = null;
  if (customerId && customerEmail) {
    const userKey = ddbKey(pk.user(customerId), sk.metadata);
    const existing = await doc.send(
      new GetCommand({
        TableName: usersTable,
        Key: userKey,
      })
    );
    if (!existing.Item) {
      const tempPassword = `BC${randomBytes(4).toString('hex')}@${String(customerPhone).replace(/\D/g, '').slice(-4) || '0000'}`;
      const passwordHash = hashPassword(tempPassword);
      const nowIso = new Date(now * 1000).toISOString();
      await doc.send(
        new PutCommand({
          TableName: usersTable,
          Item: {
            ...userKey,
            entityType: 'USER_LOGIN',
            userId: customerId,
            customerId,
            email: customerEmail.toLowerCase(),
            phone: customerPhone || null,
            passwordHash,
            loginStatus: 'ACTIVE',
            createdAt: now,
            updatedAt: now,
            createdAtIso: nowIso,
          },
          ConditionExpression: 'attribute_not_exists(PK)',
        })
      ).catch(() => undefined);
      generatedLogin = { email: customerEmail.toLowerCase(), tempPassword };
    }
  }

  let notification: { attempted: boolean; sent: boolean; error?: string } = {
    attempted: false,
    sent: false,
  };
  if (customerEmail) {
    const from = process.env.POLICY_EMAIL_FROM?.trim();
    if (from) {
      notification = { attempted: true, sent: false };
      try {
        await sesClient.send(
          new SendEmailCommand({
            FromEmailAddress: from,
            Destination: { ToAddresses: [customerEmail] },
            Content: {
              Simple: {
                Subject: { Data: `Your BharatCover policy is issued (${certificateNumber})` },
                Body: {
                  Text: {
                    Data:
                      `Hi,\n\n` +
                      `Your policy has been issued successfully.\n\n` +
                      `Policy / Certificate No.: ${certificateNumber}\n` +
                      `Policy ID: ${policyIdResolved}\n` +
                      `Status: ISSUED\n` +
                      `Policy period: ${new Date(termStart * 1000).toDateString()} - ${new Date(termEnd * 1000).toDateString()}\n` +
                      `Premium paid: ${String(pay.Item.amountPaise ?? '')} paise\n\n` +
                      (generatedLogin
                        ? `Your app login details:\nEmail: ${generatedLogin.email}\nPassword: ${generatedLogin.tempPassword}\n` +
                          `Login URL: https://www.bharatcover.net/sales/login\n\n`
                        : `Use your existing BharatCover login to view policy details.\n\n`) +
                      `Thank you for choosing BharatCover.`,
                  },
                },
              },
            },
          })
        );
        notification.sent = true;
      } catch (e) {
        console.error('payments verify send policy email', e);
        notification.error = e instanceof Error ? e.message : String(e);
      }
    } else {
      notification = {
        attempted: false,
        sent: false,
        error: 'POLICY_EMAIL_FROM is not configured',
      };
    }
  }

  return json(
    200,
    {
      verified: true,
      policyId: policyIdResolved,
      certificateNumber,
      status: 'ISSUED',
      notification,
      loginCreated: Boolean(generatedLogin),
      loginEmail: generatedLogin?.email,
    },
    event
  );
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const policiesTable = process.env.POLICIES_TABLE;
  const paymentsTable = process.env.PAYMENTS_TABLE;
  const productsTable = process.env.PRODUCTS_TABLE;
  const customersTable = process.env.CUSTOMERS_TABLE;
  const usersTable = process.env.USERS_TABLE;
  if (!policiesTable || !paymentsTable || !productsTable || !customersTable || !usersTable) {
    return json(500, { error: 'Table env not configured' }, event);
  }

  const path = event.path ?? '';
  const isVerify = path.includes('/guest/payments/verify');

  const doc = getDocClient();

  if (event.httpMethod === 'POST' && isVerify) {
    try {
      return await runVerifyPayment(event, doc, policiesTable, paymentsTable, customersTable, usersTable);
    } catch (e) {
      console.error('payments verify', e);
      return json(500, { error: 'Verify failed', message: e instanceof Error ? e.message : String(e) }, event);
    }
  }

  const policyId = event.pathParameters?.policyId;
  if (!policyId) return json(400, { error: 'policyId required' }, event);

  if (event.httpMethod === 'POST' && !isVerify) {
    const auth = await authPolicy(event, policyId);
    if ('error' in auth) return auth.error;

    const body = parseJson<unknown>(event);
    const parsed = orderBody.safeParse(body ?? {});
    if (!parsed.success) {
      return json(400, { error: 'Invalid body', details: parsed.error.flatten() }, event);
    }

    const policy = await doc.send(
      new GetCommand({
        TableName: policiesTable,
        Key: ddbKey(pk.policy(policyId), sk.metadata),
      })
    );
    if (!policy.Item) return json(404, { error: 'Policy not found' }, event);

    const productId = policy.Item.productId as string;
    const staticBase = STATIC_BASE_PREMIUM_PAISE[productId];
    let amountPaise =
      staticBase != null ? Math.round(staticBase * 1.18) : Math.round(10000 * 1.18);
    const prod = await doc.send(
      new GetCommand({
        TableName: productsTable,
        Key: ddbKey(pk.product(productId), sk.metadata),
      })
    );
    if (prod.Item?.basePremiumPaise != null) {
      amountPaise = Math.round(Number(prod.Item.basePremiumPaise) * 1.18);
    } else if (typeof prod.Item?.basePremium === 'number') {
      amountPaise = Math.round(prod.Item.basePremium * 100 * 1.18);
    }

    let keyId: string;
    let keySecret: string;
    try {
      ({ keyId, keySecret } = await resolveRazorpayKeys());
    } catch (e) {
      console.error('payments Razorpay keys', e);
      return json(500, { error: 'Razorpay keys not configured (SSM or Lambda env)' }, event);
    }
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const receipt = `guest_${policyId.slice(0, 8)}_${randomUUID().slice(0, 8)}`;
    const rzRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: parsed.data.currency,
        receipt,
        notes: {
          policyId,
          customerId: auth.payload.customerId,
          ...parsed.data.notes,
        },
      }),
    });

    const rzJson = (await rzRes.json()) as { id?: string; error?: { description?: string; code?: string } };
    if (!rzRes.ok || !rzJson.id) {
      const desc = rzJson.error?.description ?? rzJson.error?.code ?? rzRes.statusText;
      const hint =
        rzRes.status === 401 || /authentication/i.test(String(desc))
          ? 'Set real Razorpay test keys: SSM /bharatcover/landing/<stage>/razorpay-key-id and razorpay-key-secret, or set Lambda env RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET (see infra/cdk/README.md).'
          : undefined;
      return json(502, { error: 'Razorpay order failed', details: rzJson.error, message: desc, hint }, event);
    }

    const paymentId = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const paymentItem = {
      ...ddbKey(pk.policy(policyId), `PAYMENT#ORDER#${rzJson.id}`),
      entityType: 'PAYMENT',
      paymentId,
      policyId,
      razorpayOrderId: rzJson.id,
      amountPaise,
      currency: parsed.data.currency,
      paymentStatus: 'CREATED',
      createdAt: now,
      updatedAt: now,
    };

    await doc.send(new PutCommand({ TableName: paymentsTable, Item: paymentItem }));

    await doc.send(
      new UpdateCommand({
        TableName: policiesTable,
        Key: ddbKey(pk.policy(policyId), sk.metadata),
        UpdateExpression: 'SET #st = :st, #roid = :roid, #ua = :ua',
        ExpressionAttributeNames: {
          '#st': 'status',
          '#roid': 'latestRazorpayOrderId',
          '#ua': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':st': 'PENDING_PAYMENT',
          ':roid': rzJson.id,
          ':ua': now,
        },
      })
    );

    return json(
      200,
      {
        orderId: rzJson.id,
        amount: amountPaise,
        currency: parsed.data.currency,
        keyId,
        policyId,
        paymentId,
      },
      event
    );
  }

  return json(405, { error: 'Method not allowed' }, event);
};
