import crypto from 'crypto';

export function generateTemporaryPassword(): string {
  return crypto.randomBytes(6).toString('base64url');
}

export function hashRegistrationPassword(tempPassword: string, key: string): string {
  return crypto.createHmac('sha256', key).update(tempPassword).digest('hex');
}
