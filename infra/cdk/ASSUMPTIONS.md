# DynamoDB and integration assumptions

These items **must be validated** against the main `insurance-platform` repository (Lambdas under `policies/`, `payments/`, `leads/`, KYC / SurePass). Update handlers before production writes if the main platform uses different keys or attributes.

## Table names

Tables are referenced by name only: `insurance-platform-<entity>-<STAGE>` (see [lib/shared-env.ts](lib/shared-env.ts)). `STAGE` must match the **actual table suffix** in AWS (e.g. `production`, `dev`, `raghu-development` — not necessarily the literal string `development`).

## Primary keys (guest funnel writes)

DynamoDB **attribute names** are **`PK`** and **`SK`** (uppercase).

| Table | `PK` value | `SK` value | Notes |
|-------|------------|------------|-------|
| `customers` | `CUSTOMER#<uuid>` | `METADATA` | Guest profile; phone/email optional. |
| `policies` | `POLICY#<uuid>` | `METADATA` | Draft policy; `customerId`, `productId`, `status`. |
| `policies` | `SESSION#<uuid>` | `METADATA` | Guest session index linking `sessionId` → `customerId`, `policyId`. **If the main app already uses `SESSION#` for another meaning, change this prefix.** |
| `payments` | `POLICY#<policyUuid>` | `PAYMENT#ORDER#<razorpayOrderId>` | Payment row for Razorpay order. |
| `kyc-records` | `KYC_RECORD#<uuid>` | `METADATA` | KYC attempt; `policyId`, `customerId`, `status`. |

## Products table

- **Preferred:** `GetItem` with `PK = PRODUCT#<productId>`, `SK = METADATA`.
- **Alternate:** `PK = <productId>`, `SK = METADATA` (second lookup attempt).
- **List:** `Scan` with `Limit` 100; if empty, API returns a **static fallback** catalog for `pa-lite`, `pa-standard`, `pa-premium`.

## Razorpay

- **Order create:** `POST https://api.razorpay.com/v1/orders` with Basic auth (`key_id:key_secret`).
- **Client verify:** HMAC-SHA256 of `razorpay_order_id|razorpay_payment_id` with **API key secret** (same as main “public policy payment” pattern).
- **Webhook:** HMAC-SHA256 of **raw request body** with **webhook secret**; header `X-Razorpay-Signature`.
- **Canonical URL:** Configure **one** webhook URL in Razorpay (either this API’s `POST /webhooks/razorpay` or the main platform’s). See [README.md](README.md).

## SurePass

- Env: `SUREPASS_API_URL`, `SUREPASS_ENV` (non-secret); API key from SSM.
- Current implementation performs a **connectivity placeholder** only; replace with the same API paths and persistence logic as the main platform’s KYC Lambdas.

## Guest session token

- HMAC-signed payload: `{ customerId, policyId, sessionId, exp }` using secret from SSM `.../guest-session-hmac-secret`.
- Transmitted as `Authorization: Bearer <token>` or header `X-Guest-Session: <token>`.

## Unused tables in CDK grants

`users` and `subscriptions` table names are still passed in Lambda environment for parity with main env vars but **no IAM grants** are attached until handlers need them.
