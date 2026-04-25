'use client';

import { FaCheck } from 'react-icons/fa';
import checkoutStyles from '@/app/sales/checkout/checkout.module.css';

export type EkycVerificationStepProps = {
  /** Show “Use Dummy KYC (Testing)” when server allows dummy save (non-prod or explicit flag). */
  allowDummy?: boolean;
  /** Show real DigiLocker / SurePass start when configured. */
  allowReal?: boolean;
  digilockerConfigured: boolean;
  digilockerKycOk: boolean;
  kycBusy: boolean;
  dummyBusy: boolean;
  kycError: string | null;
  dummyError: string | null;
  apiBasePresent: boolean;
  dummyUiEnabled: boolean;
  /** `dummy_kyc` | `surepass_digilocker` | '' */
  kycProvider?: string;
  onStartDigilocker: () => void | Promise<void>;
  onDummyKyc: () => void | Promise<void>;
};

export function EkycVerificationStep({
  allowDummy = true,
  allowReal = true,
  digilockerConfigured,
  digilockerKycOk,
  kycBusy,
  dummyBusy,
  kycError,
  dummyError,
  apiBasePresent,
  dummyUiEnabled,
  kycProvider = '',
  onStartDigilocker,
  onDummyKyc,
}: EkycVerificationStepProps) {
  const showReal = allowReal && digilockerConfigured && !digilockerKycOk;
  const showDummy = allowDummy && dummyUiEnabled && !digilockerKycOk;

  return (
    <>
      <div className={checkoutStyles.cardHeaderRow}>
        <div className={checkoutStyles.cardHeaderText}>
          <h2 className={checkoutStyles.wizardTitle}>eKYC verification</h2>
          <p className={checkoutStyles.wizardLead}>
            Verify with DigiLocker via SurePass so we can match your identity to policy records.
          </p>
        </div>
        {digilockerKycOk ? (
          <span className={checkoutStyles.verifiedBadge}>
            <FaCheck aria-hidden style={{ fontSize: 12 }} />
            Verified
          </span>
        ) : null}
      </div>
      {digilockerKycOk && (
        <p className={checkoutStyles.confirmSuccess} style={{ marginTop: 8 }}>
          {kycProvider === 'dummy_kyc'
            ? 'Dummy KYC applied for this session (local testing).'
            : digilockerConfigured
              ? 'DigiLocker verification completed for this session.'
              : 'Identity verification marked complete for this session.'}
        </p>
      )}
      {(showReal || showDummy) && (
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
          }}
        >
          {showReal && (
            <button
              type="button"
              className={`${checkoutStyles.navBtn} ${checkoutStyles.navPrimary}`}
              style={{ maxWidth: 280, marginLeft: 0 }}
              onClick={() => void onStartDigilocker()}
              disabled={kycBusy || dummyBusy}
            >
              {kycBusy ? 'Starting…' : 'Verify with DigiLocker'}
            </button>
          )}
          {showDummy && (
            <button
              type="button"
              className={checkoutStyles.navBtn}
              onClick={() => void onDummyKyc()}
              disabled={dummyBusy || kycBusy}
              style={{ borderColor: '#93c5fd', color: '#1d4ed8' }}
            >
              {dummyBusy ? 'Applying…' : 'Use Dummy KYC (Testing)'}
            </button>
          )}
        </div>
      )}
      {kycError && <p className={checkoutStyles.fieldError}>{kycError}</p>}
      {dummyError && <p className={checkoutStyles.fieldError}>{dummyError}</p>}
      {!digilockerConfigured && (
        <p className={checkoutStyles.wizardLead} style={{ marginTop: 8 }}>
          <strong style={{ color: '#374151' }}>DigiLocker not wired on the server.</strong> Add{' '}
          <code>SUREPASS_API_URL</code>, <code>SUREPASS_API_KEY</code>, and <code>SUREPASS_ENV</code> to{' '}
          <code>.env</code> (see <code>.env.example</code>), restart Next.js, and set{' '}
          <code>NEXT_PUBLIC_SITE_URL</code> to this site&apos;s origin so redirects are allowed.
          {dummyUiEnabled && allowDummy ? ' Use dummy KYC below for local testing without keys.' : ' You can still continue for UI testing.'}
        </p>
      )}
      {!apiBasePresent && (
        <p className={checkoutStyles.wizardLead} style={{ marginTop: 16 }}>
          <strong style={{ color: '#374151' }}>Guest API:</strong> set <code>NEXT_PUBLIC_API_URL</code> for guest
          session and Razorpay after the contact flow.
        </p>
      )}
    </>
  );
}
