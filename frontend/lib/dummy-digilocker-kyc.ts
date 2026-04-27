/**
 * SurePass-shaped dummy DigiLocker KYC for local / non-production testing.
 * Do not enable in production without explicit server + client flags.
 */

export type DummyVerificationAddress = {
  combined: string;
  house: string;
  street: string;
  landmark: string;
  locality: string;
  vtc: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
};

export type DummyVerificationData = {
  fullName: string;
  dateOfBirth: string;
  yearOfBirth: number;
  gender: string;
  careOf: string;
  fatherName: string;
  address: DummyVerificationAddress;
  maskedAadhaar: string;
  profileImage: string;
  hasProfileImage: boolean;
  metadata: { mobile_number: string };
};

export type DummyKycData = {
  verified: boolean;
  transactionId: string;
  provider: 'dummy_kyc';
  clientId: string;
  verifiedAt: string;
  verificationData: DummyVerificationData;
};

/** 1×1 JPEG (minimal) — valid base64 payload for tests */
const TINY_JPEG_B64 =
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';

const DEMO_NAMES = [
  'Surya Dammalapa',
  'Priya Sharma',
  'Rahul Kumar Verma',
  'Ananya Iyer',
  'Arjun Mehta',
];

export function isDummyKycUiEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ALLOW_DUMMY_KYC === 'false') return false;
  if (process.env.NEXT_PUBLIC_ALLOW_DUMMY_KYC === 'true') return true;
  return process.env.NODE_ENV !== 'production';
}

/** Server-side gate for POST /api/kyc/dummy/save */
export function isDummyKycSaveAllowedOnServer(): boolean {
  if (process.env.ALLOW_DUMMY_KYC_IN_PRODUCTION === 'true') return true;
  return process.env.NODE_ENV !== 'production';
}

/** Treat like verified test identity in app logic; still gate dummy_kyc writes with isDummyKycSaveAllowedOnServer. */
export function isVerifiedDummyOrDigilockerProvider(p: string | undefined | null): boolean {
  if (!p) return false;
  if (p === 'dummy_kyc') return true;
  return p === 'surepass_digilocker' || p === 'SUREPASS' || p === 'surepass';
}

export function pickRandomDemoName(): string {
  return DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)]!;
}

export function splitCareAndFather(fullName: string): { careOf: string; fatherName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? 'User';
  const last = parts.slice(1).join(' ') || 'Kumar';
  return {
    careOf: `C/O ${first}`,
    fatherName: `S/O ${last}`,
  };
}

function randomMaskedLast4(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/** Build SurePass-shaped verificationData + kycData wrapper */
export function buildDummyKycPayload(phoneRaw: string): DummyKycData {
  const fullName = pickRandomDemoName();
  const { careOf, fatherName } = splitCareAndFather(fullName);
  const digits = phoneRaw.replace(/\D/g, '').slice(-10).padStart(10, '0');
  const dob = '1990-05-15';
  const yearOfBirth = 1990;
  const gender = Math.random() > 0.5 ? 'Male' : 'Female';
  const city = 'Guntur';
  const district = 'Guntur';
  const state = 'Andhra Pradesh';
  const pincode = '522004';
  const locality = 'Kannavari Thota';
  const street = 'Raghu Ram Nagar 3rd Line';
  const combined = `${street}, ${locality}, ${city}, ${district}, ${state}, India, ${pincode}`;

  const verificationData: DummyVerificationData = {
    fullName,
    dateOfBirth: dob,
    yearOfBirth,
    gender,
    careOf,
    fatherName,
    address: {
      combined,
      house: '12-3-45',
      street,
      landmark: 'Near City Centre',
      locality,
      vtc: locality,
      city,
      district,
      state,
      country: 'India',
      pincode,
    },
    maskedAadhaar: `XXXX-XXXX-${randomMaskedLast4()}`,
    profileImage: TINY_JPEG_B64,
    hasProfileImage: true,
    metadata: { mobile_number: digits },
  };

  return {
    verified: true,
    transactionId: `DUMMY${Date.now()}`,
    provider: 'dummy_kyc',
    clientId: 'DUMMY_CLIENT',
    verifiedAt: new Date().toISOString(),
    verificationData,
  };
}

/** Map verification payload to checkout personal form + phone */
export function mapDummyVerificationToForm(v: DummyVerificationData): {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  addressLine1: string;
  city: string;
  stateName: string;
  pincode: string;
  phone: string;
} {
  const g = v.gender.toLowerCase();
  const gender =
    g.startsWith('m') ? 'male' : g.startsWith('f') ? 'female' : g.startsWith('o') ? 'other' : 'other';
  const mobile = v.metadata?.mobile_number?.replace(/\D/g, '').slice(-10) ?? '';
  return {
    fullName: v.fullName,
    dateOfBirth: v.dateOfBirth,
    gender,
    addressLine1: v.address.combined,
    city: v.address.city,
    stateName: v.address.state,
    pincode: v.address.pincode.replace(/\D/g, '').slice(0, 6),
    phone: mobile.length === 10 ? `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}` : `+91 ${mobile}`,
  };
}
