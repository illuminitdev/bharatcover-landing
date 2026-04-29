/** Personal Accident calculator options — shared by `/sales` and `/sales/quote`. */
export const PA_SI_OPTIONS = [
  { amt: 100000, label: '1 Lakh', base: 253, gst: 299, short: '₹1L' },
  { amt: 500000, label: '5 Lakhs', base: 423, gst: 499, short: '₹5L' },
  { amt: 1000000, label: '10 Lakhs', base: 847, gst: 999, short: '₹10L' },
  { amt: 1500000, label: '15 Lakhs', base: 1270, gst: 1499, short: '₹15L' },
] as const;

export type PaSiAmount = (typeof PA_SI_OPTIONS)[number]['amt'];

const ALLOWED_SI = new Set<number>(PA_SI_OPTIONS.map((o) => o.amt));

export function siToProductSlug(si: number): string {
  if (si <= 100000) return 'pa-lite';
  if (si <= 500000) return 'pa-standard';
  if (si <= 1000000) return 'pa-10l';
  return 'pa-premium';
}

export function getPaOptionForSi(si: number) {
  return PA_SI_OPTIONS.find((o) => o.amt === si);
}

/** Parse `si` from query; must be one of PA_SI_OPTIONS. */
export function parseSiQuery(raw: string | null): PaSiAmount {
  const n = raw != null ? Number(raw) : NaN;
  if (!Number.isFinite(n) || !ALLOWED_SI.has(n)) {
    return 1000000;
  }
  return n as PaSiAmount;
}

export function parseGstQuery(raw: string | null): boolean {
  return raw !== '0';
}
