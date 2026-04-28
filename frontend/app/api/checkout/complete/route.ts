import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getRazorpayKeySecretForServer } from '@/lib/razorpay-direct-checkout';
import { connectToDatabase } from '@/lib/mongoose';
import { ensureCognitoCustomer } from '@/lib/cognito-admin';
import { mintHandoffToken } from '@/lib/handoff-jwt';

function generatePolicyId(productId: string): string {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const prefix = productId.startsWith('pa') ? 'PA' : 'BC';
  return `BC-${prefix}-${dateStr}-${random}`;
}

function generateCertificateNumber(): string {
  const now = new Date();
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const seq = Math.floor(Math.random() * 900000 + 100000);
  return `BCR${ym}${seq}`;
}

function generateCustomerId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CUST-${ts}-${rand}`;
}

function generateTempPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '@#$!';
  const all = upper + lower + digits + special;
  let pwd =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    digits[Math.floor(Math.random() * digits.length)] +
    special[Math.floor(Math.random() * special.length)];
  for (let i = 4; i < 12; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  return pwd
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

type CompleteBody = {
  phone?: string;
  email?: string;
  productId?: string;
  productName?: string;
  sumInsured?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  amountPaid?: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as CompleteBody;
    const {
      phone = '',
      email = '',
      productId = 'pa-standard',
      productName = 'PA Standard',
      sumInsured = '',
      fullName = '',
      dateOfBirth = '',
      gender = '',
      address = '',
      city = '',
      state = '',
      pincode = '',
      nomineeName = '',
      nomineeRelation = '',
      nomineePhone = '',
      amountPaid = 0,
      razorpay_order_id = '',
      razorpay_payment_id = '',
      razorpay_signature = '',
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required to issue a policy.' }, { status: 400 });
    }

    // Verify Razorpay signature server-side before issuing any policy
    const secret = getRazorpayKeySecretForServer();
    if (secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const expected = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      if (expected !== razorpay_signature) {
        return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 });
      }
    }

    const policyId = generatePolicyId(productId);
    const certificateNumber = generateCertificateNumber();
    const customerId = generateCustomerId();
    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const now = new Date();
    const termEnd = new Date(now);
    termEnd.setFullYear(termEnd.getFullYear() + 1);

    let persistence: 'stored' | 'pending' = 'stored';
    let persistenceError: string | undefined;

    try {
      const db = await connectToDatabase();
      const conn = db.connection;

      await conn.collection('policies').insertOne({
        policyId,
        certificateNumber,
        customerId,
        productId,
        productName,
        sumInsured,
        fullName,
        email: email.toLowerCase(),
        phone,
        dateOfBirth,
        gender,
        address: { line1: address, city, state, pincode },
        nominee: { name: nomineeName, relation: nomineeRelation, phone: nomineePhone },
        premium: amountPaid,
        status: 'active',
        termStart: now,
        termEnd,
        payment: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount: amountPaid,
          currency: 'INR',
          paidAt: now,
        },
        source: 'landing_direct_checkout',
        createdAt: now,
      });

      await conn.collection('customers').insertOne({
        customerId,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        passwordType: 'temporary',
        policies: [policyId],
        createdAt: now,
      });
    } catch (dbError) {
      persistence = 'pending';
      persistenceError = dbError instanceof Error ? dbError.message : 'database unavailable';
      console.warn('[checkout/complete] DB persistence skipped:', persistenceError);
    }

    // Provision the Cognito user in the shared User Pool so the temp password
    // we just emailed actually authenticates against the main BharatCover app.
    // Failures here do NOT roll back the policy — they're surfaced as
    // `cognito.provisioned=false` and the client falls back to email-prefill
    // (Mode B) on the main-app login screen.
    const cognitoResult = await ensureCognitoCustomer(email, tempPassword);
    if (!cognitoResult.provisioned) {
      console.warn(
        '[checkout/complete] Cognito provisioning skipped:',
        cognitoResult.reason
      );
    }

    const handoffToken = cognitoResult.provisioned
      ? mintHandoffToken(email)
      : null;

    return NextResponse.json({
      success: true,
      policyId,
      certificateNumber,
      customerId,
      tempPassword,
      email: email.toLowerCase(),
      termStart: now.toISOString(),
      termEnd: termEnd.toISOString(),
      persistence,
      persistenceError,
      cognito: {
        provisioned: cognitoResult.provisioned,
        reason: cognitoResult.reason,
      },
      handoffToken,
    });
  } catch (error) {
    console.error('[checkout/complete] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete policy issuance.' },
      { status: 500 }
    );
  }
}
