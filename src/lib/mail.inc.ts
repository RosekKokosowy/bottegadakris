import "server-only";

import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { log } from "./trace.inc";

const mock = process.env.MOCK_SMTP === "true";

const transporter = mock
  ? nodemailer.createTransport({ host: "localhost", port: 1025, secure: false })
  : nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });

export const MAIL_OFFICE = process.env.MAIL_OFFICE ?? "biuro@bottegadakris.pl";
const MAIL_FROM = process.env.MAIL_FROM ?? `"Bottega da Kris" <${MAIL_OFFICE}>`;

/** Sends a mail; failures are logged, not thrown, so a mail outage never breaks a booking. */
export async function sendMail(options: Omit<Mail.Options, "from">): Promise<boolean> {
  try {
    await transporter.sendMail({ from: MAIL_FROM, ...options });
    return true;
  } catch (error) {
    log("[Mail]", error, `sendMail() has failed to send "${options.subject}".`);
    return false;
  }
}

/** Escapes user input before it is placed into an HTML mail body. */
export const escapeHtml = (value: unknown): string =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
