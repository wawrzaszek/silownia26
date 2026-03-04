import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
    })
  : null;

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  if (!transporter) {
    console.log(`[email mock] to=${to} subject=${subject} text=${text}`);
    return;
  }

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text
  });
}
