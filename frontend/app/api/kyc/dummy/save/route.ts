import { NextRequest, NextResponse } from 'next/server';
import { isDummyKycSaveAllowedOnServer } from '@/lib/dummy-digilocker-kyc';

export async function POST(_request: NextRequest) {
  if (!isDummyKycSaveAllowedOnServer()) {
    return NextResponse.json(
      { error: 'Dummy KYC save is disabled on this server.' },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}

