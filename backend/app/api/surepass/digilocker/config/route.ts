import { NextResponse } from 'next/server';
import { getSurepassApiKey, getSurepassApiBase, getSurepassEnvLabel } from '@/lib/surepass-digilocker-proxy';

export async function GET() {
  const configured = Boolean(getSurepassApiKey());
  return NextResponse.json({
    configured,
    env: getSurepassEnvLabel(),
    baseHost: configured ? new URL(getSurepassApiBase()).host : null,
  });
}
