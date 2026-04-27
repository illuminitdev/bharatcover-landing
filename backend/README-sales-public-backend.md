# Sales Public Backend (AWS)

This backend uses stage-aware config from `shared/config.ts` and only accepts:
- `raghu-development`
- `production`

## Deploy rules

- Non-prod deploys: `STAGE=raghu-development`
- Prod deploys: `STAGE=production`

## Commands

- `npm run typecheck`
- `npm run cdk:build`
- `npm run cdk:synth`
- `npm run cdk:deploy`

## Main paths

- CDK: `cdk/bin`, `cdk/lib/stacks`, `cdk/lib/shared`
- Lambdas: `lambdas/sales`, `lambdas/payments`, `lambdas/policies`, `lambdas/auth`
- Shared runtime: `shared/config.ts`, `shared/db`, `shared/utils`, `shared/auth`, `shared/services`
