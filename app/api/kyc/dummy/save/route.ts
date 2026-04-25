import { NextResponse } from 'next/server';
import { isDummyKycSaveAllowedOnServer, type DummyKycData, type DummyVerificationData } from '@/lib/dummy-digilocker-kyc';

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

function validateVerificationData(v: unknown): v is DummyVerificationData {
  if (!isRecord(v)) return false;
  if (typeof v.fullName !== 'string' || typeof v.dateOfBirth !== 'string' || typeof v.gender !== 'string')
    return false;
  if (typeof v.yearOfBirth !== 'number') return false;
  if (typeof v.careOf !== 'string' || typeof v.fatherName !== 'string') return false;
  if (typeof v.maskedAadhaar !== 'string' || typeof v.profileImage !== 'string' || typeof v.hasProfileImage !== 'boolean')
    return false;
  if (!isRecord(v.address)) return false;
  const a = v.address;
  if (typeof a.combined !== 'string' || typeof a.city !== 'string' || typeof a.state !== 'string' || typeof a.pincode !== 'string')
    return false;
  if (!isRecord(v.metadata) || typeof v.metadata.mobile_number !== 'string') return false;
  return true;
}

function validateKycData(k: unknown): k is DummyKycData {
  if (!isRecord(k)) return false;
  if (k.verified !== true || k.provider !== 'dummy_kyc') return false;
  if (typeof k.transactionId !== 'string' || typeof k.clientId !== 'string' || typeof k.verifiedAt !== 'string')
    return false;
  if (!validateVerificationData(k.verificationData)) return false;
  return true;
}

export async function POST(req: Request) {
  if (!isDummyKycSaveAllowedOnServer()) {
    return NextResponse.json({ error: 'Dummy KYC is disabled in this environment.' }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!isRecord(json) || !isRecord(json.kycData) || !validateKycData(json.kycData)) {
    return NextResponse.json({ error: 'Invalid body: expected { kycData: DummyKycData }' }, { status: 400 });
  }

  const kyc = json.kycData;
  if (!kyc.transactionId.startsWith('DUMMY')) {
    return NextResponse.json({ error: 'transactionId must use DUMMY prefix for dummy_kyc' }, { status: 400 });
  }
  if (kyc.clientId !== 'DUMMY_CLIENT') {
    return NextResponse.json({ error: 'clientId must be DUMMY_CLIENT for dummy_kyc' }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    stored: 'validated',
    provider: kyc.provider,
    transactionId: kyc.transactionId,
  });
}
