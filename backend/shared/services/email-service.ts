import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { appConfig } from '../config';

const ses = new SESv2Client({ region: appConfig.region });

export async function sendAccountCredentialsEmail(toEmail: string, tempPassword: string): Promise<void> {
  const fromEmail = process.env.POLICY_EMAIL_FROM ?? 'noreply@bharatcover.net';
  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: fromEmail,
      Destination: { ToAddresses: [toEmail] },
      Content: {
        Simple: {
          Subject: { Data: 'Your BharatCover Account Credentials' },
          Body: {
            Text: {
              Data: `Your temporary password is: ${tempPassword}. Please reset after login.`,
            },
          },
        },
      },
    })
  );
}

export async function sendRegistrationOtpEmail(toEmail: string, otp: string): Promise<void> {
  const fromEmail = process.env.POLICY_EMAIL_FROM ?? 'noreply@bharatcover.net';
  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: fromEmail,
      Destination: { ToAddresses: [toEmail] },
      Content: {
        Simple: {
          Subject: { Data: 'Your BharatCover verification OTP' },
          Body: {
            Text: {
              Data: `Your OTP is ${otp}. It expires in 10 minutes.`,
            },
          },
        },
      },
    })
  );
}
