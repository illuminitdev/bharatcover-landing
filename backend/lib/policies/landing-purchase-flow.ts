/**
 * Landing / CDK flow — conceptual map to the main bharatcover platform modules:
 *
 * - **Guest session + draft policy (purchase intent)**: `POST /guest/sessions` (guest-sessions) → policy in Dynamo `DRAFT` / `PENDING` → personal & nominee on `PATCH /guest/policies/:id` (guest-policies).
 * - **Create payment order (tied to policy)**: `POST /guest/policies/:id/payments/orders` (payments) → Razorpay order, payment row, policy `PENDING_PAYMENT` or keep draft until order exists.
 * - **Verify policy payment (client is source of truth for “live”)**: `POST /guest/payments/verify` (payments) → HMAC verify, update payment + policy to issued/paid, term dates, certificate #.
 * - **Webhook (async, optional)**: `POST /webhooks/razorpay` (webhooks-razorpay) → `X-Razorpay-Signature` with `RAZORPAY_WEBHOOK_SECRET` / SSM. Idempotent; must not be the only path if client verify is canonical.
 * - **Direct (no guest API)**: `POST /api/razorpay/checkout-order` + `POST /api/razorpay/checkout-verify` (Next) — same HMAC, no policy row unless guest session exists; prefer guest path for full policy semantics.
 * - **Post-issue PDF + UI (landing)**: `lib/policies/policy-certificate-pdf.ts` + `GET /api/sales/policy-certificate` (Next) + `/sales/policy/[policyId]/view` — `Authorization: Bearer` guest token, same as `GET /guest/policies/:id`.
 */
export const LANDING_MODULE_MAP = {
  createGuestSession: 'CDK: lambda/guest-sessions (policy draft at intent)',
  createPolicyOrder: 'CDK: lambda/payments (Razorpay order + PENDING_PAYMENT + payment row)',
  verifyPolicyPayment: 'CDK: lambda/payments (POST /guest/payments/verify)',
  webhook: 'CDK: lambda/webhooks-razorpay (payment row only; policy stays on verify)',
} as const;
