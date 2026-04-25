import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { z } from 'zod';
import { getDocClient } from '../common/dynamo';
import { json } from '../common/http';
import { ddbKey, pk, sk } from '../common/keys';

/** Fallback when Dynamo layout differs or catalog is empty (map landing slugs → amounts). */
const STATIC_CATALOG: Record<
  string,
  { name: string; basePremiumPaise: number; sumInsured: string; currency: string }
> = {
  'pa-lite': { name: 'PA Lite', basePremiumPaise: 2000, sumInsured: '100000', currency: 'INR' },
  'pa-standard': { name: 'PA Standard', basePremiumPaise: 10000, sumInsured: '500000', currency: 'INR' },
  /** ₹10L tier — matches `siToProductSlug` / landing checkout `pa-10l`. */
  'pa-10l': { name: 'PA — ₹10 Lakhs', basePremiumPaise: 20000, sumInsured: '1000000', currency: 'INR' },
  'pa-premium': { name: 'PA Premium', basePremiumPaise: 30000, sumInsured: '1500000', currency: 'INR' },
};

const productRow = z
  .object({
    pk: z.string().optional(),
    PK: z.string().optional(),
    sk: z.string().optional(),
    SK: z.string().optional(),
    productId: z.string().optional(),
    id: z.string().optional(),
    name: z.string().optional(),
    title: z.string().optional(),
    basePremiumPaise: z.number().optional(),
    basePremium: z.number().optional(),
    sumInsured: z.union([z.string(), z.number()]).optional(),
    currency: z.string().optional(),
    status: z.string().optional(),
  })
  .passthrough();

function normalizeItem(raw: Record<string, unknown>, fallbackId?: string) {
  const p = productRow.parse(raw);
  const pkVal = p.pk ?? p.PK;
  const id =
    p.productId ??
    p.id ??
    (pkVal?.startsWith('PRODUCT#') ? pkVal.slice('PRODUCT#'.length) : undefined) ??
    fallbackId;
  const name = p.name ?? p.title ?? id ?? 'Product';
  const basePaise =
    p.basePremiumPaise ??
    (p.basePremium != null ? Math.round(p.basePremium * 100) : undefined);
  return {
    productId: id ?? 'unknown',
    name,
    basePremiumPaise: basePaise ?? 0,
    sumInsured: String(p.sumInsured ?? ''),
    currency: p.currency ?? 'INR',
    status: p.status,
  };
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const table = process.env.PRODUCTS_TABLE;
  if (!table) return json(500, { error: 'PRODUCTS_TABLE not configured' }, event);

  const method = event.httpMethod;
  const productId = event.pathParameters?.productId;

  const doc = getDocClient();

  if (method === 'GET' && !productId) {
    try {
      const out = await doc.send(
        new ScanCommand({
          TableName: table,
          Limit: 100,
        })
      );
      const items = (out.Items ?? [])
        .map((it) => normalizeItem(it as Record<string, unknown>))
        .filter((it) => it.productId !== 'unknown');
      if (items.length > 0) {
        return json(200, { products: items }, event);
      }
    } catch {
      // fall through to static
    }
    const products = Object.entries(STATIC_CATALOG).map(([id, v]) => ({
      productId: id,
      name: v.name,
      basePremiumPaise: v.basePremiumPaise,
      sumInsured: v.sumInsured,
      currency: v.currency,
      source: 'static_fallback',
    }));
    return json(200, { products }, event);
  }

  if (method === 'GET' && productId) {
    try {
      const out = await doc.send(
        new GetCommand({
          TableName: table,
          Key: ddbKey(pk.product(productId), sk.metadata),
        })
      );
      if (out.Item) {
        return json(200, { product: normalizeItem(out.Item as Record<string, unknown>, productId) }, event);
      }
      const alt = await doc.send(
        new GetCommand({
          TableName: table,
          Key: ddbKey(productId, sk.metadata),
        })
      );
      if (alt.Item) {
        return json(200, { product: normalizeItem(alt.Item as Record<string, unknown>, productId) }, event);
      }
    } catch {
      // static fallback
    }
    const s = STATIC_CATALOG[productId];
    if (s) {
      return json(
        200,
        {
          product: {
            productId,
            name: s.name,
            basePremiumPaise: s.basePremiumPaise,
            sumInsured: s.sumInsured,
            currency: s.currency,
            source: 'static_fallback',
          },
        },
        event
      );
    }
    return json(404, { error: 'Product not found' }, event);
  }

  return json(405, { error: 'Method not allowed' }, event);
};
