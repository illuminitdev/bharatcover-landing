import { NextResponse } from 'next/server';

export async function GET() {
  const configured = Boolean(
    process.env.SUREPASS_API_URL?.trim() &&
      process.env.SUREPASS_API_KEY?.trim() &&
      process.env.SUREPASS_ENV?.trim()
  );

  return NextResponse.json({ configured });
}

