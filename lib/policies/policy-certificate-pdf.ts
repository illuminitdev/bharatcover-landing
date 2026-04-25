import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

type PolicyDoc = {
  policyId?: string;
  productId?: string;
  status?: string;
  certificateNumber?: string;
  fullName?: string;
  termStart?: number;
  termEnd?: number;
  paymentCompletedAt?: number;
  [key: string]: unknown;
};

function fmtDate(isoOrUnix: number | undefined) {
  if (isoOrUnix == null) return '—';
  const ms = typeof isoOrUnix === 'number' && isoOrUnix < 1e12 ? isoOrUnix * 1000 : Number(isoOrUnix);
  if (!Number.isFinite(ms)) return '—';
  return new Date(ms).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export async function buildPolicyCertificatePdfBytes(policy: PolicyDoc): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { width, height } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const margin = 56;
  let y = height - margin;

  const cert = (policy.certificateNumber as string) || (policy.policyId as string) || '—';
  const line = (text: string, size = 11, bold = false, r = 0, g = 0, b = 0) => {
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(r, g, b),
    });
    y -= size + 6;
  };

  line('BharatCover', 18, true, 0, 0.2, 0.5);
  line('Policy certificate', 14, true, 0.1, 0.1, 0.1);
  y -= 8;

  line(`Certificate no.: ${cert}`, 12, true);
  line(`Status: ${String(policy.status ?? '—')}`, 11);
  y -= 4;
  line(`Product: ${String(policy.productId ?? '—')}`, 11);
  line(`Proposer: ${String(policy.fullName?.trim() || '—')}`, 11);
  y -= 4;
  line(`Policy period: ${fmtDate(policy.termStart as number | undefined)} — ${fmtDate(policy.termEnd as number | undefined)}`, 11);
  if (policy.paymentCompletedAt) {
    line(`Payment completed: ${fmtDate(policy.paymentCompletedAt as number)}`, 10, false, 0.2, 0.2, 0.2);
  }
  y -= 16;
  line('This is a system-generated document for your records. Please retain a copy with your', 9, false, 0.35, 0.35, 0.35);
  line('insurance records. For queries, contact BharatCover support using the email on file.', 9, false, 0.35, 0.35, 0.35);

  page.drawLine({ start: { x: margin, y: 56 }, end: { x: width - margin, y: 56 }, thickness: 0.5, color: rgb(0.85, 0.88, 0.92) });
  page.drawText('BharatCover — Personal Accident', {
    x: margin,
    y: 40,
    size: 8,
    font,
    color: rgb(0.4, 0.45, 0.5),
  });

  return pdf.save();
}
