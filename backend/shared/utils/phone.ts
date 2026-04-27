export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(-10);
}

export function isValidIndianPhone(raw: string): boolean {
  const phone = normalizePhone(raw);
  return /^[6-9]\d{9}$/.test(phone);
}
