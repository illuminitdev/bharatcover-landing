/**
 * Key helpers — align with insurance-platform Lambdas (see ASSUMPTIONS.md).
 *
 * DynamoDB **attribute names** on platform tables are `PK` / `SK` (not `pk` / `sk`).
 */
export const ATTR = { PK: 'PK', SK: 'SK' } as const;

/** Partition + sort key map for GetItem / Put / Update / Query Key expressions. */
export function ddbKey(partition: string, sort: string): Record<string, string> {
  return { [ATTR.PK]: partition, [ATTR.SK]: sort };
}

export const pk = {
  customer: (id: string) => `CUSTOMER#${id}`,
  user: (id: string) => `USER#${id}`,
  policy: (id: string) => `POLICY#${id}`,
  /** Guest funnel session index (same policies table as policy rows). */
  session: (sessionId: string) => `SESSION#${sessionId}`,
  product: (productId: string) => `PRODUCT#${productId}`,
  kycRecord: (id: string) => `KYC_RECORD#${id}`,
};

export const sk = {
  metadata: 'METADATA',
};
