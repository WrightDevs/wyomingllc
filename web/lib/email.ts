import 'server-only';
import { q } from './db';
import { randomBytes } from 'node:crypto';
import { APP_URL, RESEND_API_KEY, EMAIL_FROM } from './env';
import { Resend } from 'resend';

export type EmailLog = {
    id: string;
    to_email: string;
    subject: string;
    template: string;
    metadata: Record<string, unknown>;
    created_at: string;
};

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function renderEmailHtml(template: string, data: Record<string, unknown>): string {
    if (template === 'verify_email') {
        const link = String(data.verificationLink || '#');
        const name = String(data.name || 'Valued Client');
        return `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #0f172a;">
                <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <div style="background-color: #1e3a8a; padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Wyoming Attorney</h1>
                        <p style="color: #bfdbfe; margin: 4px 0 0 0; font-size: 13px;">Business Registration & Asset Protection</p>
                    </div>
                    <div style="padding: 32px 28px;">
                        <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0; color: #0f172a;">Verify Your Email Address</h2>
                        <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                            Hello ${name},<br/><br/>
                            Thank you for initiating your business services with Wyoming Attorney. Please confirm your email address to access your client dashboard and track your entity formations.
                        </p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${link}" style="background-color: #1e3a8a; color: #ffffff; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>
                        <p style="font-size: 12px; line-height: 1.5; color: #6b7280; margin: 24px 0 0 0;">
                            This link expires in 24 hours. If the button above does not work, copy and paste this link into your browser:<br/>
                            <a href="${link}" style="color: #2563eb; word-break: break-all;">${link}</a>
                        </p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 16px 24px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                        © ${new Date().getFullYear()} Wyoming Attorney. 1309 Coffeen Avenue, Sheridan, WY 82801.
                    </div>
                </div>
            </div>
        `;
    }

    if (template === 'new_formation') {
        const name = String(data.name || 'Valued Client');
        const companyName = String(data.companyName || 'Your Company');
        const entityType = String(data.entityType || 'LLC');
        const formationState = String(data.formationState || 'Wyoming');
        const date = String(data.date || new Date().toLocaleDateString());

        return `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #0f172a;">
                <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <div style="background-color: #1e3a8a; padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Wyoming Attorney</h1>
                        <p style="color: #bfdbfe; margin: 4px 0 0 0; font-size: 13px;">Filing Acknowledgement</p>
                    </div>
                    <div style="padding: 32px 28px;">
                        <div style="display: inline-block; background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px;">
                            Application Received
                        </div>
                        <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0; color: #0f172a;">Filing Received: ${companyName}</h2>
                        <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 20px 0;">
                            Dear ${name},<br/><br/>
                            We have received your business formation application for <strong>${companyName}</strong>. Our legal filing team will prepare your Articles of Organization and submit them directly to the Wyoming Secretary of State.
                        </p>
                        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; margin: 24px 0;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                <tr>
                                    <td style="color: #6b7280; padding: 6px 0;">Entity Name:</td>
                                    <td style="color: #0f172a; font-weight: 600; text-align: right; padding: 6px 0;">${companyName}</td>
                                </tr>
                                <tr>
                                    <td style="color: #6b7280; padding: 6px 0;">Entity Type:</td>
                                    <td style="color: #0f172a; font-weight: 600; text-align: right; padding: 6px 0;">${entityType}</td>
                                </tr>
                                <tr>
                                    <td style="color: #6b7280; padding: 6px 0;">Jurisdiction:</td>
                                    <td style="color: #0f172a; font-weight: 600; text-align: right; padding: 6px 0;">${formationState}</td>
                                </tr>
                                <tr>
                                    <td style="color: #6b7280; padding: 6px 0;">Filing Date:</td>
                                    <td style="color: #0f172a; font-weight: 600; text-align: right; padding: 6px 0;">${date}</td>
                                </tr>
                            </table>
                        </div>
                        <div style="text-align: center; margin: 28px 0 10px 0;">
                            <a href="${APP_URL}/dashboard/filings" style="background-color: #1e3a8a; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
                                View Filing Status in Portal
                            </a>
                        </div>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 16px 24px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                        © ${new Date().getFullYear()} Wyoming Attorney. All rights reserved.
                    </div>
                </div>
            </div>
        `;
    }

    return `<p>Wyoming Attorney Notification: ${JSON.stringify(data)}</p>`;
}

/**
 * Creates and dispatches an email notification via Resend,
 * and records the event in email_logs in Postgres.
 */
export async function sendEmailNotification(payload: {
    to: string;
    subject: string;
    template: 'verify_email' | 'new_formation' | 'formation_status';
    data: Record<string, unknown>;
}): Promise<void> {
    const toEmail = payload.to.toLowerCase().trim();

    // 1. Audit log in Postgres database
    try {
        await q`
            insert into email_logs (to_email, subject, template, metadata)
            values (${toEmail}, ${payload.subject}, ${payload.template}, ${JSON.stringify(payload.data)}::jsonb)
        `;
    } catch (err) {
        console.error('Failed to log email to database:', err);
    }

    // 2. Dispatch via Resend if API key is provided
    if (resend) {
        try {
            const htmlContent = renderEmailHtml(payload.template, payload.data);
            const { data, error } = await resend.emails.send({
                from: EMAIL_FROM,
                to: toEmail,
                subject: payload.subject,
                html: htmlContent
            });

            if (error) {
                console.error('[RESEND ERROR]', error);
            } else {
                console.log(`[RESEND SENT] ID: ${data?.id} | To: ${toEmail} | Subject: "${payload.subject}"`);
            }
        } catch (resendErr) {
            console.error('[RESEND DISPATCH FAILED]', resendErr);
        }
    } else {
        console.log(`[EMAIL LOGGED (RESEND_API_KEY NOT SET)] To: ${toEmail} | Subject: "${payload.subject}" | Template: ${payload.template}`);
    }
}

/**
 * Generate a secure verification token and send verification email.
 */
export async function createAndSendVerificationEmail(userId: string, email: string, name?: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await q`
        insert into verification_tokens (token, user_id, email, expires_at)
        values (${token}, ${userId}, ${email.toLowerCase().trim()}, ${expiresAt.toISOString()})
    `;

    const verificationLink = `${APP_URL}/api/verify-email?token=${token}`;

    await sendEmailNotification({
        to: email,
        subject: 'Verify your email — Wyoming Attorney',
        template: 'verify_email',
        data: {
            name: name || 'Valued Client',
            verificationLink,
            expiresAt: expiresAt.toISOString()
        }
    });

    return token;
}

/**
 * Send formation receipt and acknowledgement email upon submitting a new company.
 */
export async function sendNewFormationEmail(params: {
    email: string;
    name: string;
    companyName: string;
    entityType: string;
    formationState: string;
}): Promise<void> {
    await sendEmailNotification({
        to: params.email,
        subject: `Filing Received: ${params.companyName} — Wyoming Attorney`,
        template: 'new_formation',
        data: {
            name: params.name,
            companyName: params.companyName,
            entityType: params.entityType,
            formationState: params.formationState,
            status: 'pending',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
    });
}

