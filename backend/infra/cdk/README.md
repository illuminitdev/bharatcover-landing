# Landing guest API (AWS CDK)

Deploys a **separate REST API** (API Gateway + Node.js 20 Lambdas) for the BharatCover marketing site funnel. It **imports** existing DynamoDB tables from `insurance-platform-*-<STAGE>` and does **not** create duplicate database stacks.

## Prerequisites

- Node 20+
- AWS credentials (`AWS_PROFILE` or env vars) with permissions to deploy CloudFormation, Lambda, API Gateway, IAM, and to read SSM parameters used below.
- Same **AWS account** and **region** as the main `insurance-platform` backend.
- `STAGE` must **exactly match** the DynamoDB table name suffix in that account (e.g. `production`, `dev`, `raghu-development`). It is **not** always the word `development` — list tables (`insurance-platform-policies-*`) and pass the same suffix, e.g. `-c stage=raghu-development`.

## SSM parameters (create before first deploy)

Path prefix: `/bharatcover/landing/<STAGE>/` (use the **same** `STAGE` value as `-c stage=...`, e.g. `raghu-development`).

| Parameter | Type | Example purpose |
|-----------|------|------------------|
| `guest-session-hmac-secret` | SecureString | HMAC secret for guest Bearer tokens |
| `razorpay-key-id` | String or SecureString | Razorpay key id (`rzp_...`) |
| `razorpay-key-secret` | SecureString | Razorpay API secret |
| `razorpay-webhook-secret` | SecureString | Razorpay webhook signing secret |

Optional (KYC):

| Parameter | Description |
|-----------|-------------|
| `surepass-api-key` | SurePass API key |

Non-secret SurePass URL/env are set on Lambdas via CDK context or stack env (`SUREPASS_API_URL`, `SUREPASS_ENV`).

## Deploy

```bash
cd infra/cdk
npm install

# Synth (optional) — use the same region as your DynamoDB tables (e.g. us-east-1)
CDK_DEFAULT_ACCOUNT=<account> CDK_DEFAULT_REGION=us-east-1 npx cdk synth -c stage=raghu-development

# Deploy — stage must match table suffixes (e.g. insurance-platform-policies-raghu-development)
CDK_DEFAULT_ACCOUNT=<account> CDK_DEFAULT_REGION=us-east-1 npx cdk deploy LandingPublicApi-raghu-development \
  -c stage=raghu-development
```

`allowedOrigins` is optional. If not provided, this stack now defaults to `*` for CORS.

Outputs include **ApiUrl** — set the Next.js app’s `NEXT_PUBLIC_API_URL` to this base (no trailing slash).

### Razorpay (guest payments Lambda)

`POST /guest/policies/{id}/payments/orders` reads **Razorpay key id + secret** from SSM (`razorpay-key-id`, `razorpay-key-secret` under your landing prefix). Placeholder values cause **502 Razorpay order failed**.

**Option A — SSM (recommended):** put real test keys in Parameter Store for your stage, e.g. `aws ssm put-parameter --name /bharatcover/landing/raghu-development/razorpay-key-id --value rzp_test_... --type String --overwrite` and `razorpay-key-secret` as `SecureString`.

**Option B — deploy-time env (dev only):** pass keys only when deploying (they are stored on the Lambda in plain text — use test keys only):

`LANDING_RAZORPAY_KEY_ID=rzp_test_xxx LANDING_RAZORPAY_KEY_SECRET=yyy npx cdk deploy ...`

The Payments Lambda uses **`RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`** when both are set on the function; otherwise it falls back to SSM.

### Post-payment policy email (Payments Lambda)

After successful `POST /guest/payments/verify`, the Payments Lambda can email policy details to the customer's stored email.

- Set deploy-time env: `LANDING_POLICY_EMAIL_FROM=policies@yourdomain.com`
- The sender must be SES-verified in the same AWS region.
- If not configured, policy issuance still succeeds and the response includes notification status.

### Webhook secret (`/webhooks/razorpay` Lambda)

This is **not** the API key secret. Create a [Webhook](https://dashboard.razorpay.com/) (Test or Live) pointing to `https://<ApiUrl>webhooks/razorpay` and copy the **webhook secret** for that entry into SSM as `…/razorpay-webhook-secret` (or set `RAZORPAY_WEBHOOK_SECRET` on the `RazorpayWebhookFn` Lambda, or at deploy: `LANDING_RAZORPAY_WEBHOOK_SECRET=...`). The literal `your_razorpay_webhook_secret` in templates is a placeholder, not a real value.

### CI

- Export `CDK_DEFAULT_ACCOUNT`, `CDK_DEFAULT_REGION`, and pass `-c stage=<STAGE>`.
- Ensure the CI role can `ssm:GetParameter` on `arn:aws:ssm:<region>:<account>:parameter/bharatcover/landing/<STAGE>/*` and deploy the stack.

## Razorpay webhook (single canonical handler)

Razorpay allows a limited set of webhook URLs. **Do not** register two different URLs that both perform conflicting state updates for `payment.captured`.

Choose one:

1. **This API** — Point Razorpay to `POST {ApiUrl}webhooks/razorpay` (note: stage may appear in path; use the exact invoke URL from API Gateway + `/webhooks/razorpay`).
2. **Main platform only** — Leave webhook on the main API; omit or no-op this route in Razorpay, and rely on main Lambdas for capture events.

If both stacks must react, use **one** receiver and forward (SQS/EventBridge) to the other—document that architecture explicitly.

## API reference

See [openapi/landing-public.yaml](openapi/landing-public.yaml) for OpenAPI 3.0 paths and schemas.

## Assumptions vs main backend

See [ASSUMPTIONS.md](ASSUMPTIONS.md).
