'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaCheck, FaChevronLeft, FaCreditCard, FaLock, FaShieldAlt } from 'react-icons/fa';
import { CheckoutStepper } from '@/components/sales/CheckoutStepper';
import { EkycVerificationStep } from '@/components/sales/EkycVerificationStep';
import {
  buildDummyKycPayload,
  isDummyKycUiEnabled,
  mapDummyVerificationToForm,
} from '@/lib/dummy-digilocker-kyc';
import { isClientDirectCheckoutRazorpayAllowed } from '@/lib/razorpay-direct-checkout';
import { CHECKOUT_WIZARD_STORAGE_KEY } from '@/lib/checkout-wizard-draft';
import {
  getGuestApiBase,
  GUEST_SESSION_STORAGE,
} from '@/lib/guest-api';
import { paymentService } from '@/lib/services/payments';
import { policyService } from '@/lib/services/policies';
import { productService } from '@/lib/services/products';
import styles from './checkout.module.css';
const DIGILOCKER_CLIENT_KEY = 'bharatcover_digilocker_client_id';

type WizardDraft = {
  activeStep?: number;
  digilockerKycOk?: boolean;
  kycProvider?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  addressLine1?: string;
  city?: string;
  stateName?: string;
  pincode?: string;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
};

function stripDigilockerReturnParams(sp: URLSearchParams): URLSearchParams {
  const q = new URLSearchParams(sp.toString());
  for (const k of ['client_id', 'digilocker_client_id', 'cl_id', 'kyc', 'digilocker_status']) {
    q.delete(k);
  }
  return q;
}

function readWizardDraft(): WizardDraft {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem(CHECKOUT_WIZARD_STORAGE_KEY) || '{}') as WizardDraft;
  } catch {
    return {};
  }
}

function writeWizardDraft(partial: WizardDraft) {
  const prev = readWizardDraft();
  const next = { ...prev, ...partial };
  if (next.activeStep != null && next.activeStep > 3) {
    delete next.activeStep;
  }
  sessionStorage.setItem(CHECKOUT_WIZARD_STORAGE_KEY, JSON.stringify(next));
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(s);
  });
}

/** `price` is annual premium including 18% GST (matches marketing site). */
const productMap: Record<string, { name: string; price: number; si: string }> = {
  'pa-lite': { name: 'PA Lite', price: 24, si: '₹1 Lakh' },
  'pa-standard': { name: 'PA Standard', price: 118, si: '₹5 Lakhs' },
  'pa-10l': { name: 'PA — ₹10 Lakhs', price: 236, si: '₹10 Lakhs' },
  'pa-premium': { name: 'PA Premium', price: 354, si: '₹15 Lakhs' },
};

function splitGstInclusive(totalIncl: number) {
  const base = Math.round(totalIncl / 1.18);
  const gst = totalIncl - base;
  return { base, gst, total: totalIncl };
}

function formatPolicyDateUnix(unix: number | undefined) {
  if (unix == null) return '—';
  const ms = unix < 1e12 ? unix * 1000 : unix;
  return new Date(ms).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

type GuestPolicyConfirm = {
  policyId?: string;
  certificateNumber?: string;
  productId?: string;
  fullName?: string;
  status?: string;
  termStart?: number;
  termEnd?: number;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  paymentCompletedAt?: number;
};

type LocalPolicyData = {
  policyId: string;
  certificateNumber: string;
  tempPassword: string;
  email: string;
  termStart: string;
  termEnd: string;
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const productId = searchParams.get('product') || 'pa-standard';
  const phoneQ = searchParams.get('phone') || '';
  const emailQ = searchParams.get('email') || '';

  const [activeStep, setActiveStep] = useState(0);
  const [phone, setPhone] = useState(phoneQ || '+91 XXXXX XXXXX');
  const [email, setEmail] = useState(emailQ || 'user@example.com');
  const [product, setProduct] = useState(
    () => productMap[productId] || productMap['pa-standard']!
  );
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paidOk, setPaidOk] = useState(false);
  /** Set only after a successful `POST /guest/payments/verify` (not direct Razorpay). */
  const [guestIssuedPolicyId, setGuestIssuedPolicyId] = useState<string | null>(null);
  const [guestCertificateNo, setGuestCertificateNo] = useState<string | null>(null);
  const [confirmPolicy, setConfirmPolicy] = useState<GuestPolicyConfirm | null>(null);
  /** Set when /api/checkout/complete generates a local policy + login after direct Razorpay payment. */
  const [localPolicyData, setLocalPolicyData] = useState<LocalPolicyData | null>(null);
  const [confirmPolicyLoading, setConfirmPolicyLoading] = useState(false);
  const [confirmPolicyError, setConfirmPolicyError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('');
  const [nomineePhone, setNomineePhone] = useState('');
  const [stepError, setStepError] = useState<string | null>(null);
  const [wizardHydrated, setWizardHydrated] = useState(false);
  const [digilockerConfigured, setDigilockerConfigured] = useState(false);
  const [digilockerKycOk, setDigilockerKycOk] = useState(false);
  const [kycBusy, setKycBusy] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);
  const [dummyBusy, setDummyBusy] = useState(false);
  const [dummyError, setDummyError] = useState<string | null>(null);
  const [kycProvider, setKycProvider] = useState<string>('');

  const { base, gst, total } = splitGstInclusive(product.price);
  const dummyUiEnabled = useMemo(() => isDummyKycUiEnabled(), []);

  // Always-fresh snapshot of form fields for use inside the startPayment callback.
  const latestFormDataRef = useRef({ fullName, dateOfBirth, gender, addressLine1, city, stateName, pincode, nomineeName, nomineeRelation, nomineePhone });
  latestFormDataRef.current = { fullName, dateOfBirth, gender, addressLine1, city, stateName, pincode, nomineeName, nomineeRelation, nomineePhone };

  useEffect(() => {
    const storedPhone = sessionStorage.getItem(GUEST_SESSION_STORAGE.phone);
    const storedEmail = sessionStorage.getItem(GUEST_SESSION_STORAGE.email);
    if (storedPhone) setPhone(storedPhone);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
    const d = readWizardDraft();
    if (d.fullName != null) setFullName(d.fullName);
    if (d.dateOfBirth != null) setDateOfBirth(d.dateOfBirth);
    if (d.gender != null) setGender(d.gender);
    if (d.addressLine1 != null) setAddressLine1(d.addressLine1);
    if (d.city != null) setCity(d.city);
    if (d.stateName != null) setStateName(d.stateName);
    if (d.pincode != null) setPincode(d.pincode);
    if (d.nomineeName != null) setNomineeName(d.nomineeName);
    if (d.nomineeRelation != null) setNomineeRelation(d.nomineeRelation);
    if (d.nomineePhone != null) setNomineePhone(d.nomineePhone);
    if (d.digilockerKycOk === true) setDigilockerKycOk(true);
    if (d.kycProvider) setKycProvider(d.kycProvider);
    if (d.activeStep != null && d.activeStep >= 0 && d.activeStep <= 3) {
      setActiveStep(d.activeStep);
    }
    setWizardHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/surepass/digilocker/config');
        const data = (await res.json()) as { configured?: boolean };
        if (!cancelled && data.configured) setDigilockerConfigured(true);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const searchKey = searchParams.toString();

  useEffect(() => {
    const cid =
      searchParams.get('client_id')?.trim() ||
      searchParams.get('digilocker_client_id')?.trim() ||
      searchParams.get('cl_id')?.trim();
    if (!cid) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/surepass/digilocker/status?client_id=${encodeURIComponent(cid)}`);
        const data = (await res.json()) as { verified?: boolean };
        if (cancelled) return;
        if (data.verified) {
          setDigilockerKycOk(true);
          setKycProvider('surepass_digilocker');
          sessionStorage.setItem(DIGILOCKER_CLIENT_KEY, cid);
          const q = stripDigilockerReturnParams(new URLSearchParams(searchParams.toString()));
          router.replace(`${pathname}${q.toString() ? `?${q}` : ''}`, { scroll: false });
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchKey, pathname, router]);

  useEffect(() => {
    if (!wizardHydrated) return;
    writeWizardDraft({
      activeStep: activeStep <= 3 ? activeStep : undefined,
      digilockerKycOk,
      kycProvider: kycProvider || undefined,
      fullName,
      dateOfBirth,
      gender,
      addressLine1,
      city,
      stateName,
      pincode,
      nomineeName,
      nomineeRelation,
      nomineePhone,
    });
  }, [
    wizardHydrated,
    activeStep,
    digilockerKycOk,
    kycProvider,
    fullName,
    dateOfBirth,
    gender,
    addressLine1,
    city,
    stateName,
    pincode,
    nomineeName,
    nomineeRelation,
    nomineePhone,
  ]);

  useEffect(() => {
    const baseUrl = getGuestApiBase();
    if (!baseUrl) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await productService.byIdForGuestCheckout(productId);
        if (!res.ok) return;
        const data = (await res.json()) as {
          product?: { name?: string; basePremiumPaise?: number; sumInsured?: string };
        };
        const p = data.product;
        if (!p || cancelled) return;
        const rupee = Math.round(((p.basePremiumPaise ?? 0) * 1.18) / 100);
        if (rupee > 0) {
          setProduct({
            name: p.name ?? productId,
            price: rupee,
            si: p.sumInsured ? `₹${p.sumInsured}` : product.si,
          });
        }
      } catch {
        /* keep static */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, product.si]);

  useEffect(() => {
    if (!guestIssuedPolicyId) {
      setConfirmPolicy(null);
      setConfirmPolicyError(null);
    }
  }, [guestIssuedPolicyId]);

  useEffect(() => {
    if (!paidOk || !guestIssuedPolicyId || activeStep !== 4) return;
    const mode =
      (typeof window !== 'undefined' && sessionStorage.getItem('bharatcover_checkout_mode')) || '';
    if (mode !== 'landing_guest') return;
    const base = getGuestApiBase();
    if (!base) return;
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem(GUEST_SESSION_STORAGE.token);
    if (!token) {
      setConfirmPolicyError('Session missing; refresh policy from View policy if needed.');
      return;
    }
    let cancelled = false;
    (async () => {
      setConfirmPolicyLoading(true);
      setConfirmPolicyError(null);
      try {
        const res = await policyService.byIdForGuest(guestIssuedPolicyId, token);
        const data = (await res.json().catch(() => ({}))) as { policy?: GuestPolicyConfirm; error?: string };
        if (cancelled) return;
        if (!res.ok) {
          setConfirmPolicyError(data.error ?? `Could not load policy (${res.status})`);
          setConfirmPolicy(null);
          return;
        }
        if (data.policy) {
          setConfirmPolicy(data.policy);
          if (data.policy.certificateNumber) {
            setGuestCertificateNo((prev) => prev ?? data.policy!.certificateNumber ?? null);
          }
        } else {
          setConfirmPolicy(null);
        }
      } catch (e) {
        if (!cancelled) {
          setConfirmPolicyError(e instanceof Error ? e.message : 'Failed to load policy');
          setConfirmPolicy(null);
        }
      } finally {
        if (!cancelled) setConfirmPolicyLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paidOk, guestIssuedPolicyId, activeStep]);

  const validatePersonal = useCallback((): boolean => {
    if (fullName.trim().length < 2) {
      setStepError('Please enter your full name.');
      return false;
    }
    if (!dateOfBirth.trim()) {
      setStepError('Please enter your date of birth.');
      return false;
    }
    if (addressLine1.trim().length < 5) {
      setStepError('Please enter a complete address.');
      return false;
    }
    if (city.trim().length < 2) {
      setStepError('Please enter your city.');
      return false;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setStepError('Please enter a valid 6-digit PIN code.');
      return false;
    }
    if (!gender.trim()) {
      setStepError('Please select gender.');
      return false;
    }
    if (stateName.trim().length < 2) {
      setStepError('Please enter state / UT.');
      return false;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setStepError('Please enter a valid 10-digit phone number.');
      return false;
    }
    setStepError(null);
    return true;
  }, [fullName, dateOfBirth, addressLine1, city, pincode, gender, stateName, phone]);

  const validateNominee = useCallback((): boolean => {
    if (nomineeName.trim().length < 2) {
      setStepError('Please enter nominee name.');
      return false;
    }
    if (nomineeRelation.trim().length < 2) {
      setStepError('Please enter relationship with nominee.');
      return false;
    }
    const n = nomineePhone.replace(/\D/g, '');
    if (nomineePhone.trim() && n.length !== 10) {
      setStepError('Nominee phone should be 10 digits, or leave blank.');
      return false;
    }
    setStepError(null);
    return true;
  }, [nomineeName, nomineeRelation, nomineePhone]);

  const goBack = () => {
    setStepError(null);
    setActiveStep((s) => Math.max(0, s - 1));
  };

  const runDummyKyc = useCallback(async () => {
    setDummyError(null);
    setDummyBusy(true);
    try {
      const kycData = buildDummyKycPayload(phone);
      const saveUrl = process.env.NEXT_PUBLIC_DUMMY_KYC_SAVE_URL?.trim() || '/api/kyc/dummy/save';
      try {
        const res = await fetch(saveUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kycData }),
        });
        if (!res.ok) {
          // Non-blocking in local/testing: continue checkout with dummy identity.
          // eslint-disable-next-line no-console
          console.warn('Dummy KYC save rejected; continuing with local dummy verification.');
        }
      } catch {
        // Non-blocking in local/testing: continue checkout with dummy identity.
        // eslint-disable-next-line no-console
        console.warn('Dummy KYC save request failed; continuing with local dummy verification.');
      }

      const token = sessionStorage.getItem(GUEST_SESSION_STORAGE.token);
      const policyId = sessionStorage.getItem(GUEST_SESSION_STORAGE.policyId);
      const api = getGuestApiBase();
      if (api && token && policyId) {
        try {
          const startRes = await policyService.startGuestKyc(policyId, token);
          if (startRes.ok) {
            await policyService.submitGuestKycResult(policyId, token, {
              status: 'success',
              vendorReference: kycData.transactionId,
              raw: {
                provider: 'dummy_kyc',
                kycData,
              },
            });
          }
        } catch {
          /* ignore guest forward errors */
        }
      }

      const mapped = mapDummyVerificationToForm(kycData.verificationData);
      setFullName(mapped.fullName);
      setDateOfBirth(mapped.dateOfBirth);
      setGender(mapped.gender);
      setAddressLine1(mapped.addressLine1);
      setCity(mapped.city);
      setStateName(mapped.stateName);
      setPincode(mapped.pincode);
      setPhone(mapped.phone);
      setDigilockerKycOk(true);
      setKycProvider('dummy_kyc');
      try {
        sessionStorage.setItem(
          'bharatcover_dummy_kyc_last',
          JSON.stringify({ kycData, savedAt: new Date().toISOString() })
        );
      } catch {
        /* ignore */
      }
    } catch (e) {
      setDummyError(e instanceof Error ? e.message : 'Dummy KYC failed');
    } finally {
      setDummyBusy(false);
    }
  }, [phone]);

  const startDigilocker = async () => {
    setKycError(null);
    setKycBusy(true);
    try {
      const qs = searchParams.toString();
      const redirect_url = `${window.location.origin}${pathname}${qs ? `?${qs}` : ''}`;
      const res = await fetch('/api/surepass/digilocker/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirect_url }),
      });
      const data = (await res.json()) as {
        error?: string;
        link?: string | null;
        client_id?: string | null;
      };
      if (!res.ok) {
        setKycError(data.error ?? 'Could not start DigiLocker');
        return;
      }
      if (data.client_id) sessionStorage.setItem(DIGILOCKER_CLIENT_KEY, data.client_id);
      if (data.link) {
        window.location.href = data.link;
        return;
      }
      setKycError('SurePass did not return a DigiLocker link. Check the API response in the network tab.');
    } catch (e) {
      setKycError(e instanceof Error ? e.message : 'DigiLocker request failed');
    } finally {
      setKycBusy(false);
    }
  };

  const goNext = () => {
    setStepError(null);
    if (activeStep === 0 && digilockerConfigured && !digilockerKycOk) {
      setStepError('Complete DigiLocker verification before continuing.');
      return;
    }
    if (activeStep === 1 && !validatePersonal()) return;
    if (activeStep === 2 && !validateNominee()) return;
    setActiveStep((s) => Math.min(4, s + 1));
  };

  const startPayment = useCallback(async () => {
    setPayError(null);
    const token = sessionStorage.getItem(GUEST_SESSION_STORAGE.token);
    const policyId = sessionStorage.getItem(GUEST_SESSION_STORAGE.policyId);
    const sessionId = sessionStorage.getItem(GUEST_SESSION_STORAGE.sessionId);
    const apiBase = getGuestApiBase();
    const keyFromEnv = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
    const checkoutMode =
      (typeof window !== 'undefined' && sessionStorage.getItem('bharatcover_checkout_mode')) ||
      '';
    const isLocalGuestToken = Boolean(token?.startsWith('local_guest_'));

    type RzpSuccess = {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    const openRazorpayCheckout = async (opts: {
      key: string;
      amount: number;
      orderId: string;
      currency: string;
      verify: (response: RzpSuccess) => Promise<boolean>;
    }) => {
      await loadRazorpayScript();
      const Rp = window.Razorpay;
      if (!Rp) {
        setPayError('Razorpay script not available');
        setPaying(false);
        return;
      }
      const rzp = new Rp({
        key: opts.key,
        amount: opts.amount,
        currency: opts.currency,
        order_id: opts.orderId,
        name: 'BharatCover',
        description: product.name,
        prefill: { contact: phone.replace(/\D/g, '').slice(-10), email },
        theme: { color: '#0066cc' },
        handler: async (response: RzpSuccess) => {
          try {
            const ok = await opts.verify(response);
            if (ok) {
              setPaidOk(true);
              setActiveStep(4);
            }
          } catch {
            setPayError('Verification request failed');
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });
      rzp.open();
    };

    setPaying(true);
    try {
      if (checkoutMode === 'sales_public' && sessionId && policyId) {
        const orderRes = await paymentService.createSalesPublicOrder({
          sessionId,
          policyId,
          amount: product.price,
          currency: 'INR',
        });
        const orderJson = (await orderRes.json().catch(() => ({}))) as {
          error?: string;
          orderId?: string;
          amount?: number;
          currency?: string;
          keyId?: string;
          key?: string;
        };
        if (!orderRes.ok) {
          setPayError(orderJson.error ?? `Sales public order failed (${orderRes.status})`);
          setPaying(false);
          return;
        }
        const key = orderJson.keyId ?? orderJson.key ?? keyFromEnv;
        if (!key || !orderJson.orderId || orderJson.amount == null) {
          setPayError('Invalid sales-public order response');
          setPaying(false);
          return;
        }
        await openRazorpayCheckout({
          key,
          amount: orderJson.amount,
          orderId: orderJson.orderId,
          currency: orderJson.currency ?? 'INR',
          verify: async (response) => {
            const verifyRes = await paymentService.verifySalesPublicPayment({
              sessionId,
              policyId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
            const verifyJson = (await verifyRes.json().catch(() => ({}))) as {
              error?: string;
              verified?: boolean;
            };
            if (!verifyRes.ok || !verifyJson.verified) {
              setPayError(verifyJson.error ?? 'Sales-public payment verification failed');
              return false;
            }

            const finalizeRes = await paymentService.finalizeSalesPublicAccount({
              sessionId,
              policyId,
            });
            if (!finalizeRes.ok) {
              const finalizeJson = (await finalizeRes.json().catch(() => ({}))) as { error?: string };
              setPayError(finalizeJson.error ?? 'Payment verified, but account finalization failed');
              return false;
            }

            setGuestIssuedPolicyId(policyId);
            setGuestCertificateNo((prev) => prev ?? policyId.slice(0, 12).toUpperCase());
            return true;
          },
        });
        return;
      }

      if (apiBase && token && policyId && !isLocalGuestToken) {
        const orderRes = await paymentService.createGuestPolicyOrder(policyId, token);
        const orderJson = (await orderRes.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
          hint?: string;
          orderId?: string;
          amount?: number;
          currency?: string;
          keyId?: string;
          paymentId?: string;
        };
        if (orderRes.ok) {
          const key = orderJson.keyId;
          if (!key || !orderJson.orderId || orderJson.amount == null) {
            setPayError('Invalid order response from API');
            setPaying(false);
            return;
          }
          if (orderJson.paymentId) {
            try {
              sessionStorage.setItem(GUEST_SESSION_STORAGE.paymentId, orderJson.paymentId);
            } catch {
              /* ignore */
            }
          }
          await openRazorpayCheckout({
            key,
            amount: orderJson.amount,
            orderId: orderJson.orderId,
            currency: orderJson.currency ?? 'INR',
            verify: async (response) => {
              const body: Record<string, string> = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };
              if (policyId) body.policyId = policyId;
              const recentPaymentId = (() => {
                try {
                  return sessionStorage.getItem(GUEST_SESSION_STORAGE.paymentId);
                } catch {
                  return null;
                }
              })();
              if (recentPaymentId) body.paymentId = recentPaymentId;
              /* Same-origin Next route proxies to the guest API (avoids API Gateway CORS on /verify from dev ports). */
              const verifyRes = await paymentService.verifyGuestPolicyPayment(token, body);
              const verifyText = await verifyRes.text();
              let verifyData: Record<string, unknown> = {};
              try {
                if (verifyText) verifyData = JSON.parse(verifyText) as Record<string, unknown>;
              } catch {
                verifyData = { error: 'Invalid verify response', raw: verifyText.slice(0, 200) };
              }
              if (!verifyRes.ok) {
                const parts = [
                  typeof verifyData.error === 'string' ? verifyData.error : null,
                  typeof verifyData.message === 'string' ? verifyData.message : null,
                  typeof verifyData.step === 'string' ? `(step: ${verifyData.step})` : null,
                  typeof verifyData.hint === 'string' ? verifyData.hint : null,
                ].filter(Boolean);
                setPayError(parts.length ? parts.join(' — ') : `Verification failed (${verifyRes.status})`);
                return false;
              }
              const v = verifyData as {
                certificateNumber?: string;
                policyId?: string;
                verified?: boolean;
              };
              if (v.policyId) {
                setGuestIssuedPolicyId(v.policyId);
                try {
                  if (v.certificateNumber) {
                    sessionStorage.setItem(GUEST_SESSION_STORAGE.certificateNumber, v.certificateNumber);
                    setGuestCertificateNo(v.certificateNumber);
                  }
                } catch {
                  /* ignore */
                }
              }
              return true;
            },
          });
          return;
        }
        const detail =
          orderJson.message ??
          orderJson.hint ??
          (typeof orderJson.error === 'string' ? orderJson.error : undefined);
        setPayError(
          detail ??
            `Guest policy order failed (${orderRes.status}). Complete backend guest payment configuration to issue policy and login.`
        );
        setPaying(false);
        return;
      }

      if (isClientDirectCheckoutRazorpayAllowed()) {
        const res = await paymentService.createDirectCheckoutOrder(productId);
        const j = (await res.json().catch(() => ({}))) as {
          error?: string;
          helpUrl?: string;
          orderId?: string;
          amount?: number;
          currency?: string;
          keyId?: string;
        };
        if (!res.ok) {
          const base =
            typeof j.error === 'string'
              ? j.error
              : 'Could not create Razorpay order. Add RAZORPAY_KEY_SECRET in .env (Razorpay Dashboard → Test mode → API Keys → Reveal).';
          const help = j.helpUrl ? ` ${j.helpUrl}` : '';
          setPayError(base + help);
          setPaying(false);
          return;
        }
        const key = j.keyId ?? keyFromEnv;
        if (!key || !j.orderId || j.amount == null) {
          setPayError('Invalid direct order response');
          setPaying(false);
          return;
        }
        await openRazorpayCheckout({
          key,
          amount: j.amount,
          orderId: j.orderId,
          currency: j.currency ?? 'INR',
          verify: async (response) => {
            const verifyRes = await paymentService.verifyDirectCheckoutPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (!verifyRes.ok) {
              const v = (await verifyRes.json().catch(() => ({}))) as { error?: string };
              setPayError(v.error ?? 'Verification failed');
              return false;
            }
            // Payment signature verified — now issue policy + create login in MongoDB.
            const fd = latestFormDataRef.current;
            try {
              const completeRes = await fetch('/api/checkout/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  phone,
                  email,
                  productId,
                  productName: product.name,
                  sumInsured: product.si,
                  fullName: fd.fullName,
                  dateOfBirth: fd.dateOfBirth,
                  gender: fd.gender,
                  address: fd.addressLine1,
                  city: fd.city,
                  state: fd.stateName,
                  pincode: fd.pincode,
                  nomineeName: fd.nomineeName,
                  nomineeRelation: fd.nomineeRelation,
                  nomineePhone: fd.nomineePhone,
                  amountPaid: product.price,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              if (completeRes.ok) {
                const cd = (await completeRes.json()) as LocalPolicyData;
                setLocalPolicyData(cd);
              } else {
                const errJson = (await completeRes.json().catch(() => ({}))) as { error?: string };
                // Non-blocking: payment succeeded, but log why issuance failed.
                console.warn('[checkout/complete] failed:', errJson.error ?? completeRes.status);
              }
            } catch (err) {
              console.warn('[checkout/complete] request error:', err);
            }
            setGuestIssuedPolicyId(null);
            setGuestCertificateNo(null);
            return true;
          },
        });
        return;
      }

      setPayError(
        'Guest checkout needs a valid guest session (create one from quote). For local fallback, enable direct Razorpay mode in dev.'
      );
      setPaying(false);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Payment could not start');
      setPaying(false);
    }
  }, [phone, email, product.name, product.price, productId]);

  const downloadGuestPolicyPdf = useCallback(async () => {
    const id = guestIssuedPolicyId;
    if (!id) return;
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem(GUEST_SESSION_STORAGE.token);
    if (!token) {
      setPayError('Your session has expired. Start checkout again from the quote step.');
      return;
    }
    setPayError(null);
    const res = await fetch(`/api/sales/policy-certificate?policyId=${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setPayError('Could not download the policy PDF. Try View policy, then download from that page.');
      return;
    }
    const blob = await res.blob();
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `bharatcover-policy-${guestCertificateNo || id}.pdf`;
    a.click();
    URL.revokeObjectURL(u);
  }, [guestIssuedPolicyId, guestCertificateNo]);

  const stepBody = (() => {
    switch (activeStep) {
      case 0:
        return (
          <EkycVerificationStep
            allowDummy
            allowReal
            digilockerConfigured={digilockerConfigured}
            digilockerKycOk={digilockerKycOk}
            kycBusy={kycBusy}
            dummyBusy={dummyBusy}
            kycError={kycError}
            dummyError={dummyError}
            dummyUiEnabled={dummyUiEnabled}
            kycProvider={kycProvider}
            onStartDigilocker={startDigilocker}
            onDummyKyc={runDummyKyc}
          />
        );
      case 1:
        return (
          <>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderText}>
                <h2 className={styles.wizardTitle}>Personal Details</h2>
                <p className={styles.wizardLead}>Your verified information from Aadhaar</p>
              </div>
              {digilockerKycOk ? (
                <span className={styles.verifiedBadge}>
                  <FaCheck aria-hidden style={{ fontSize: 12 }} />
                  {kycProvider === 'dummy_kyc' ? 'Verified (dummy / test)' : 'Verified via Aadhaar'}
                </span>
              ) : null}
            </div>

            <div className={styles.formGrid2}>
              <div className={styles.formRow}>
                <label className={styles.labelReq} htmlFor="checkout-fullName">
                  Full Name <span className={styles.req}>*</span>
                </label>
                <input
                  id="checkout-fullName"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.labelReq} htmlFor="checkout-dob">
                  Date of Birth <span className={styles.req}>*</span>
                </label>
                <input
                  id="checkout-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.labelReq} htmlFor="checkout-phone">
                  Phone Number <span className={styles.req}>*</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.labelReq} htmlFor="checkout-gender">
                  Gender <span className={styles.req}>*</span>
                </label>
                <select id="checkout-gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <hr className={styles.divider} />
            <h3 className={styles.formSectionTitle}>Address Details</h3>

            <div className={styles.formGrid2}>
              <div className={`${styles.formRow} ${styles.formRowFull}`}>
                <label className={styles.labelReq} htmlFor="checkout-address">
                  Address <span className={styles.req}>*</span>
                </label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  autoComplete="street-address"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.addressGrid3} style={{ marginTop: 20 }}>
              <div className={styles.formRow}>
                <label className={styles.labelReq} htmlFor="checkout-city">
                  City <span className={styles.req}>*</span>
                </label>
                <input id="checkout-city" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <label className={styles.labelReq} htmlFor="checkout-state">
                  State <span className={styles.req}>*</span>
                </label>
                <input
                  id="checkout-state"
                  autoComplete="address-level1"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.labelReq} htmlFor="checkout-pin">
                  Pincode <span className={styles.req}>*</span>
                </label>
                <input
                  id="checkout-pin"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderText}>
                <h2 className={styles.wizardTitle}>Family &amp; Nominee</h2>
                <p className={styles.wizardLead}>Nominee receives benefits as per policy terms.</p>
              </div>
            </div>
            <div className={styles.formGrid2}>
              <div className={styles.formRow}>
                <label className={styles.labelReq} htmlFor="checkout-nominee-name">
                  Nominee full name <span className={styles.req}>*</span>
                </label>
                <input
                  id="checkout-nominee-name"
                  autoComplete="name"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.labelReq} htmlFor="checkout-nominee-rel">
                  Relationship <span className={styles.req}>*</span>
                </label>
                <input
                  id="checkout-nominee-rel"
                  placeholder="e.g. Spouse, Parent"
                  value={nomineeRelation}
                  onChange={(e) => setNomineeRelation(e.target.value)}
                />
              </div>
              <div className={`${styles.formRow} ${styles.formRowFull}`}>
                <label className={styles.labelReq} htmlFor="checkout-nominee-phone">
                  Nominee phone <span style={{ color: '#6b7280', fontWeight: 600 }}>(optional)</span>
                </label>
                <input
                  id="checkout-nominee-phone"
                  type="tel"
                  inputMode="tel"
                  value={nomineePhone}
                  onChange={(e) => setNomineePhone(e.target.value)}
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <div className={styles.layout}>
            <div className={styles.summaryCard}>
              <h3 className={styles.sectionTitle}>
                <FaShieldAlt style={{ color: '#0066cc' }} />
                Policy summary
              </h3>

              <div className={styles.productRow}>
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p>Personal Accident Cover · Annual Policy</p>
                </div>
                <div className={styles.productPrice}>₹{total}</div>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>Sum insured</label>
                  <p>{product.si}</p>
                </div>
                <div className={styles.detailItem}>
                  <label>Tenure</label>
                  <p>1 Year</p>
                </div>
                <div className={styles.detailItem}>
                  <label>Phone</label>
                  <p>{phone}</p>
                </div>
                <div className={styles.detailItem}>
                  <label>Email</label>
                  <p>{email}</p>
                </div>
              </div>

              <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Base premium</span>
                  <span className={styles.totalVal}>₹{base}</span>
                </div>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>GST (18%)</span>
                  <span className={styles.totalVal}>₹{gst}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Total payable</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <div className={styles.paymentCard}>
              <h3 className={styles.sectionTitle}>
                <FaCreditCard style={{ color: '#0066cc' }} />
                Secure payment
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '32px' }}>
                Choose your preferred payment method and complete the transaction securely.
              </p>

              {paidOk && (
                <p style={{ color: '#00c853', fontWeight: 600, marginBottom: '16px' }}>
                  Payment verified. Continue to confirmation.
                </p>
              )}
              {payError && (
                <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '16px' }}>{payError}</p>
              )}

              <button
                type="button"
                className={styles.paymentBtn}
                onClick={() => void startPayment()}
                disabled={paying || paidOk}
              >
                {paying ? 'Opening…' : paidOk ? 'Paid' : `Pay securely ₹${total}`}
              </button>

              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#00c853',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  <FaLock />
                  <span>SSL secure checkout</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '12px' }}>
                  By clicking pay, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        );
      case 4:
      default:
        if (paidOk) {
          return (
            <>
              <div className={styles.cardHeaderRow}>
                <div className={styles.cardHeaderText}>
                  <h2 className={styles.wizardTitle}>Confirmation</h2>
                  <p className={styles.wizardLead}>You&apos;re all set</p>
                </div>
                <span className={styles.verifiedBadge}>
                  <FaCheck aria-hidden style={{ fontSize: 12 }} />
                  Paid
                </span>
              </div>
              <p className={styles.confirmSuccess}>Payment verified. Thank you for choosing BharatCover.</p>
              <p className={styles.confirmMuted}>
                A confirmation has been recorded for <strong>{product.name}</strong>. We&apos;ll use{' '}
                <strong>{email}</strong> for policy communication.
              </p>
              {guestIssuedPolicyId && confirmPolicyLoading && (
                <p className={styles.confirmPolicyLoading} role="status">
                  Loading policy details…
                </p>
              )}
              {guestIssuedPolicyId && confirmPolicyError && (
                <p className={styles.policyDetailsError}>{confirmPolicyError}</p>
              )}
              {guestIssuedPolicyId && !confirmPolicyLoading && confirmPolicy && (
                <div className={styles.policyDetailsPanel}>
                  <h3 className={styles.policyDetailsTitle}>Policy details</h3>
                  <div className={styles.policyDetailsGrid}>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Policy / certificate no.</span>
                      <span className={styles.policyDetailsValue}>
                        {confirmPolicy.certificateNumber || guestCertificateNo || '—'}
                      </span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Status</span>
                      <span className={styles.policyDetailsValue}>
                        {confirmPolicy.status ? String(confirmPolicy.status) : '—'}
                      </span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Insured name</span>
                      <span className={styles.policyDetailsValue}>
                        {confirmPolicy.fullName?.trim() || fullName.trim() || '—'}
                      </span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Product</span>
                      <span className={styles.policyDetailsValue}>
                        {confirmPolicy.productId === productId
                          ? product.name
                          : (confirmPolicy.productId ?? '—').replace(/-/g, ' ')}
                      </span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Sum insured</span>
                      <span className={styles.policyDetailsValue}>{product.si}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Premium paid (incl. GST)</span>
                      <span className={styles.policyDetailsValue}>₹{total}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Policy period</span>
                      <span className={styles.policyDetailsValue}>
                        {formatPolicyDateUnix(confirmPolicy.termStart)} — {formatPolicyDateUnix(confirmPolicy.termEnd)}
                      </span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Phone</span>
                      <span className={styles.policyDetailsValue}>
                        {phone.replace(/\D/g, '').length >= 10 ? phone : '—'}
                      </span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Communication email</span>
                      <span className={styles.policyDetailsValue}>{email}</span>
                    </div>
                    {(confirmPolicy.nomineeName != null && String(confirmPolicy.nomineeName).trim() !== '') ||
                    nomineeName.trim() ? (
                      <div className={`${styles.policyDetailsItem} ${styles.policyDetailsItemWide}`}>
                        <span className={styles.policyDetailsLabel}>Nominee</span>
                        <span className={styles.policyDetailsValue}>
                          {(confirmPolicy.nomineeName || nomineeName).trim() || '—'}
                          {(() => {
                            const rel = (confirmPolicy.nomineeRelation || nomineeRelation).trim();
                            return rel ? ` (${rel})` : '';
                          })()}
                          {(() => {
                            const np = (confirmPolicy.nomineePhone || nomineePhone).replace(/\D/g, '');
                            if (np.length === 10) {
                              return ` · ${(confirmPolicy.nomineePhone || nomineePhone).trim()}`;
                            }
                            return '';
                          })()}
                        </span>
                      </div>
                    ) : null}
                    {guestIssuedPolicyId && (
                      <div className={`${styles.policyDetailsItem} ${styles.policyDetailsItemWide}`}>
                        <span className={styles.policyDetailsLabel}>Reference (internal)</span>
                        <span className={styles.policyRefId}>{guestIssuedPolicyId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Local policy issuance (direct Razorpay path) */}
              {paidOk && localPolicyData && (
                <div className={styles.policyDetailsPanel}>
                  <h3 className={styles.policyDetailsTitle}>Policy Details</h3>
                  <div className={styles.policyDetailsGrid}>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Policy ID</span>
                      <span className={styles.policyRefId}>{localPolicyData.policyId}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Certificate No.</span>
                      <span className={styles.policyDetailsValue}>{localPolicyData.certificateNumber}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Product</span>
                      <span className={styles.policyDetailsValue}>{product.name}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Insured</span>
                      <span className={styles.policyDetailsValue}>{fullName.trim() || '—'}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Premium (incl. GST)</span>
                      <span className={styles.policyDetailsValue}>₹{total}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Email</span>
                      <span className={styles.policyDetailsValue}>{localPolicyData.email}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Policy Period</span>
                      <span className={styles.policyDetailsValue}>
                        {new Date(localPolicyData.termStart).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {' — '}
                        {new Date(localPolicyData.termEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {nomineeName.trim() ? (
                      <div className={`${styles.policyDetailsItem} ${styles.policyDetailsItemWide}`}>
                        <span className={styles.policyDetailsLabel}>Nominee</span>
                        <span className={styles.policyDetailsValue}>
                          {nomineeName.trim()}
                          {nomineeRelation.trim() ? ` (${nomineeRelation.trim()})` : ''}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.loginCredentialsBox}>
                    <h4 className={styles.loginCredentialsTitle}>Your Login Credentials</h4>
                    <p className={styles.loginCredentialsSubtitle}>
                      Use these details to access your policy portal:
                    </p>
                    <div className={styles.loginCredentialsGrid}>
                      <div className={styles.loginCredentialRow}>
                        <span className={styles.loginCredentialLabel}>Email (Login ID)</span>
                        <span className={styles.loginCredentialValue}>{localPolicyData.email}</span>
                      </div>
                      <div className={styles.loginCredentialRow}>
                        <span className={styles.loginCredentialLabel}>Temporary Password</span>
                        <span className={`${styles.loginCredentialValue} ${styles.loginCredentialPassword}`}>
                          {localPolicyData.tempPassword}
                        </span>
                      </div>
                    </div>
                    <p className={styles.loginCredentialsNote}>
                      Please change your password after your first login.
                    </p>
                    <Link href="/sales/login" className={styles.loginCredentialsBtn}>
                      Login to Policy Portal →
                    </Link>
                  </div>
                </div>
              )}

              {/* Fallback: payment succeeded but local issuance was not available */}
              {paidOk && !guestIssuedPolicyId && !localPolicyData && (
                <div className={styles.policyDetailsPanel}>
                  <h3 className={styles.policyDetailsTitle}>Payment details</h3>
                  <p className={styles.directPayNote}>
                    Your payment was received. Policy issuance is being processed — you will receive confirmation at <strong>{email}</strong>.
                  </p>
                  <div className={styles.policyDetailsGrid}>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Product</span>
                      <span className={styles.policyDetailsValue}>{product.name}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Insured</span>
                      <span className={styles.policyDetailsValue}>{fullName.trim() || '—'}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Premium (incl. GST)</span>
                      <span className={styles.policyDetailsValue}>₹{total}</span>
                    </div>
                    <div className={styles.policyDetailsItem}>
                      <span className={styles.policyDetailsLabel}>Email</span>
                      <span className={styles.policyDetailsValue}>{email}</span>
                    </div>
                    {nomineeName.trim() ? (
                      <div className={`${styles.policyDetailsItem} ${styles.policyDetailsItemWide}`}>
                        <span className={styles.policyDetailsLabel}>Nominee</span>
                        <span className={styles.policyDetailsValue}>
                          {nomineeName.trim()}
                          {nomineeRelation.trim() ? ` (${nomineeRelation.trim()})` : ''}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              {guestIssuedPolicyId && (
                <div className={styles.postPayActions} role="group" aria-label="Policy documents">
                  <Link
                    href={`/sales/policy/${encodeURIComponent(guestIssuedPolicyId)}/view`}
                    className={`${styles.postPayBtn} ${styles.postPayBtnSecondary}`}
                  >
                    View policy
                  </Link>
                  <button
                    type="button"
                    className={`${styles.postPayBtn} ${styles.postPayBtnPrimary}`}
                    onClick={() => void downloadGuestPolicyPdf()}
                  >
                    Download policy
                  </button>
                  <Link href="/sales/login" className={`${styles.postPayBtn} ${styles.postPayBtnSecondary}`}>
                    Policy login
                  </Link>
                </div>
              )}
            </>
          );
        }
        return (
          <>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderText}>
                <h2 className={styles.wizardTitle}>Confirmation</h2>
                <p className={styles.wizardLead}>Finish payment to complete your purchase</p>
              </div>
            </div>
            <p className={styles.confirmMuted}>
              Complete payment on the previous step to finish checkout. If you closed the payment window, go back to
              payment and try again.
            </p>
          </>
        );
    }
  })();

  const navOnPayment = activeStep === 3;
  const primaryNavLabel =
    activeStep === 0 ? 'Continue' : activeStep === 1 || activeStep === 2 ? 'Save & Continue' : 'Continue';

  const productStrip =
    activeStep <= 2 ? (
      <div className={styles.productStrip}>
        <div className={styles.productStripLeft}>
          <div className={styles.productStripIcon}>
            <FaShieldAlt aria-hidden />
          </div>
          <div>
            <p className={styles.productStripName}>{product.name}</p>
            <p className={styles.productStripCategory}>Personal Accident · Annual policy</p>
          </div>
        </div>
        <div className={styles.productStripRight}>
          <div className={styles.productStripPremiumLabel}>Premium</div>
          <div className={styles.productStripPrice}>₹{total}</div>
          <div className={styles.productStripCoverage}>Coverage: {product.si}</div>
        </div>
      </div>
    ) : null;

  const navInner =
    activeStep === 4 && paidOk ? (
      <>
        <div style={{ flex: 1, minWidth: 0 }} aria-hidden />
        <Link
          href="/sales"
          className={`${styles.navBtn} ${styles.navPrimary}`}
          style={{ textDecoration: 'none', maxWidth: 'none' }}
        >
          Back to Products
          <FaArrowRight aria-hidden style={{ fontSize: 12 }} />
        </Link>
      </>
    ) : activeStep === 4 && !paidOk ? (
      <>
        <button type="button" className={styles.navBtn} onClick={() => setActiveStep(3)}>
          <FaArrowLeft aria-hidden style={{ fontSize: 12 }} />
          Back to payment
        </button>
        <Link href="/sales" className={`${styles.navBtn} ${styles.navPrimary}`} style={{ textDecoration: 'none' }}>
          Back to Products
        </Link>
      </>
    ) : (
      <>
        <button type="button" className={styles.navBtn} onClick={goBack} disabled={activeStep === 0}>
          <FaArrowLeft aria-hidden style={{ fontSize: 12 }} />
          Back
        </button>
        {navOnPayment ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
            {!paidOk && (
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Use Pay securely above to finish.</span>
            )}
            {paidOk && (
              <button type="button" className={`${styles.navBtn} ${styles.navPrimary}`} onClick={() => setActiveStep(4)}>
                Continue to confirmation
                <FaArrowRight aria-hidden style={{ fontSize: 12 }} />
              </button>
            )}
          </div>
        ) : (
          <button type="button" className={`${styles.navBtn} ${styles.navPrimary}`} onClick={goNext}>
            {primaryNavLabel}
            <FaArrowRight aria-hidden style={{ fontSize: 12 }} />
          </button>
        )}
      </>
    );

  return (
    <div className={styles.pageShell}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brandLink} aria-label="Go to BharatCover home">
          <Image
            src="/logo.png"
            alt="BharatCover"
            width={220}
            height={55}
            priority
            className={styles.brandLogo}
          />
        </Link>
        <Link href="/sales" className={styles.backLink}>
          <FaChevronLeft aria-hidden style={{ fontSize: 11 }} />
          Back to Products
        </Link>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Purchase {product.name}</h1>
          <p className={styles.pageSubtitle}>Complete the steps below to purchase your insurance policy</p>
        </header>

        <div className={styles.stepperWrap}>
          <CheckoutStepper currentStep={activeStep} />
        </div>

        {productStrip}

        {activeStep === 3 ? (
          <>
            <div className={`${styles.wizardBody} ${styles.wizardBodyWide}`}>{stepBody}</div>
            {stepError && (
              <p className={styles.fieldError} style={{ maxWidth: 1040, margin: '12px auto 0' }}>
                {stepError}
              </p>
            )}
            <div className={`${styles.wizardNav} ${styles.navWideRow}`}>{navInner}</div>
            <div className={styles.trustBadges}>
              <div style={{ fontWeight: 700, color: '#cbd5e1' }}>VISA</div>
              <div style={{ fontWeight: 700, color: '#cbd5e1' }}>MASTERCARD</div>
              <div style={{ fontWeight: 700, color: '#cbd5e1' }}>UPI</div>
              <div style={{ fontWeight: 700, color: '#cbd5e1' }}>RAZORPAY</div>
            </div>
          </>
        ) : (
          <div className={styles.wizardCard}>
            {stepBody}
            {stepError ? <p className={styles.fieldError}>{stepError}</p> : null}
            <div className={styles.wizardNav}>{navInner}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
