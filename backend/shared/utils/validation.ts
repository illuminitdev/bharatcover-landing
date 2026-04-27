import { z } from 'zod';
import { isValidIndianPhone, normalizePhone } from './phone';

export const createSessionSchema = z.object({
  email: z.string().email(),
  phone: z.string().refine(isValidIndianPhone, 'Invalid phone'),
  productId: z.string().min(2),
});

export const updateSessionSchema = z.object({
  sessionId: z.string().min(6),
  step: z.enum(['ekyc', 'personal', 'family', 'nominee']),
  payload: z.record(z.unknown()),
});

export const createOrderSchema = z.object({
  sessionId: z.string().min(6),
  policyId: z.string().min(6),
  amount: z.number().positive(),
  currency: z.string().default('INR'),
});

export const verifyPaymentSchema = z.object({
  sessionId: z.string().min(6),
  policyId: z.string().min(6),
  paymentId: z.string().min(6),
  orderId: z.string().min(6),
  signature: z.string().min(8),
});

export function sanitizePhone(phone: string): string {
  return normalizePhone(phone);
}
