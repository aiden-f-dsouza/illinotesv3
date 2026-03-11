import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "IlliNotes <noreply@illinotes.com>"
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://illinotes.com"

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const url = `${BASE_URL}/verify-email?token=${token}`
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your IlliNotes account",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #C66B4D; font-family: Merriweather, Georgia, serif;">IlliNotes</h1>
        <h2>Verify your email</h2>
        <p>Click the button below to verify your IlliNotes account. This link expires in 24 hours.</p>
        <a href="${url}" style="display:inline-block;background:#C66B4D;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
          Verify Email
        </a>
        <p style="color:#6B6B6B;font-size:14px;">Or copy this link: ${url}</p>
        <p style="color:#8B8B8B;font-size:12px;">If you didn't sign up for IlliNotes, you can ignore this email.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const url = `${BASE_URL}/reset-password?token=${token}`
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your IlliNotes password",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #C66B4D; font-family: Merriweather, Georgia, serif;">IlliNotes</h1>
        <h2>Reset your password</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${url}" style="display:inline-block;background:#C66B4D;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#6B6B6B;font-size:14px;">Or copy this link: ${url}</p>
        <p style="color:#8B8B8B;font-size:12px;">If you didn't request this, you can ignore this email. Your password will not change.</p>
      </div>
    `,
  })
}

export async function sendMentionNotification(
  toEmail: string,
  mentionedBy: string,
  noteTitle: string,
  commentBody: string
): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `${mentionedBy} mentioned you on IlliNotes`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #C66B4D; font-family: Merriweather, Georgia, serif;">IlliNotes</h1>
        <p><strong>${mentionedBy}</strong> mentioned you in a comment on <em>${noteTitle}</em>:</p>
        <blockquote style="border-left: 3px solid #C66B4D; padding-left: 16px; color: #4A4A4A; margin: 16px 0;">
          ${commentBody}
        </blockquote>
        <a href="${BASE_URL}/notes" style="display:inline-block;background:#C66B4D;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          View Notes
        </a>
      </div>
    `,
  })
}
