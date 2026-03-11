"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db/prisma"
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email/resend"
import { hasProfanitySubstring } from "@/lib/profanity/checker"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import crypto from "crypto"
import { z } from "zod"

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username required"),
  password: z.string().min(1, "Password required"),
})

const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z
    .string()
    .min(3, "Username must be 3–20 characters")
    .max(20, "Username must be 3–20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  displayName: z.string().min(1, "Display name required").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export type ActionResult = { error?: string; success?: string }

// ─── LOGIN ────────────────────────────────────────────────────────────────────

export async function loginAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { identifier, password } = parsed.data
  const supabase = await createClient()

  let email = identifier
  // If no @ → treat as username, look up email
  if (!identifier.includes("@")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", identifier.toLowerCase())
      .single()
    if (!profile?.email) return { error: "Username not found" }
    email = profile.email
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please verify your email before logging in." }
    }
    return { error: "Invalid credentials. Please try again." }
  }

  redirect("/notes")
}

// ─── SIGNUP ───────────────────────────────────────────────────────────────────

export async function signupAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { email, username, displayName, password } = parsed.data

  // Profanity check
  if (hasProfanitySubstring(username, displayName)) {
    return { error: "Username or display name contains inappropriate language." }
  }

  const supabase = await createClient()
  const adminClient = await createAdminClient()

  // Check username uniqueness
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase())
    .single()
  if (existing) return { error: "Username already taken." }

  // Create auth user (email_confirm: false — we handle verification manually)
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  })
  if (authError) {
    if (authError.message.includes("already registered")) {
      return { error: "An account with this email already exists." }
    }
    return { error: authError.message }
  }

  const userId = authData.user.id

  // Create profile
  await supabase.from("profiles").insert({
    id: userId,
    email,
    username: username.toLowerCase(),
    display_name: displayName,
    is_admin: false,
  })

  // Create verification token
  const token = crypto.randomBytes(30).toString("hex")
  await prisma.emailVerificationToken.create({
    data: { email, user_id: userId, token },
  })

  // Send verification email
  try {
    await sendVerificationEmail(email, token)
  } catch (e) {
    console.error("Failed to send verification email:", e)
  }

  return { success: "Account created! Please check your email to verify your account." }
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  })
  if (!record) return { error: "Invalid or expired verification link." }
  if (record.is_used) return { error: "This verification link has already been used." }

  const expiresAt = new Date(record.created_at.getTime() + 24 * 60 * 60 * 1000)
  if (new Date() > expiresAt) return { error: "Verification link expired. Please request a new one." }

  const adminClient = await createAdminClient()
  const { error } = await adminClient.auth.admin.updateUserById(record.user_id, {
    email_confirm: true,
  })
  if (error) return { error: "Verification failed. Please try again." }

  await prisma.emailVerificationToken.update({
    where: { token },
    data: { is_used: true },
  })

  return { success: "Email verified! You can now log in." }
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

export async function forgotPasswordAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get("email")?.toString().trim()
  if (!email) return { error: "Email is required." }

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single()

  // Don't reveal whether email exists
  if (!profile) {
    return { success: "If that email is registered, you'll receive a reset link shortly." }
  }

  const token = crypto.randomBytes(30).toString("hex")
  await prisma.passwordResetToken.create({
    data: { email, token },
  })

  try {
    await sendPasswordResetEmail(email, token)
  } catch (e) {
    console.error("Failed to send reset email:", e)
  }

  return { success: "If that email is registered, you'll receive a reset link shortly." }
}

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────

export async function resetPasswordAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const token = formData.get("token")?.toString()
  const password = formData.get("password")?.toString()

  if (!token || !password) return { error: "Invalid request." }
  if (password.length < 8) return { error: "Password must be at least 8 characters." }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } })
  if (!record || record.is_used) return { error: "Invalid or expired reset link." }

  const expiresAt = new Date(record.created_at.getTime() + 60 * 60 * 1000)
  if (new Date() > expiresAt) return { error: "Reset link expired. Please request a new one." }

  const adminClient = await createAdminClient()

  // Find user by email
  const { data: users } = await adminClient.auth.admin.listUsers()
  const user = users?.users?.find((u) => u.email === record.email)
  if (!user) return { error: "User not found." }

  const { error } = await adminClient.auth.admin.updateUserById(user.id, { password })
  if (error) return { error: "Failed to reset password. Please try again." }

  await prisma.passwordResetToken.update({
    where: { token },
    data: { is_used: true },
  })

  return { success: "Password reset successfully! You can now log in." }
}

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────

export async function changePasswordAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const currentPassword = formData.get("currentPassword")?.toString()
  const newPassword = formData.get("newPassword")?.toString()

  if (!currentPassword || !newPassword) return { error: "All fields are required." }
  if (newPassword.length < 8) return { error: "New password must be at least 8 characters." }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  // Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })
  if (signInError) return { error: "Current password is incorrect." }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: "Failed to update password." }

  revalidatePath("/profile")
  return { success: "Password changed successfully." }
}

// ─── RESEND VERIFICATION ──────────────────────────────────────────────────────

export async function resendVerificationAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get("email")?.toString().trim()
  if (!email) return { error: "Email required." }

  // Invalidate old tokens
  await prisma.emailVerificationToken.updateMany({
    where: { email, is_used: false },
    data: { is_used: true },
  })

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single()
  if (!profile) return { error: "No account found with that email." }

  const token = crypto.randomBytes(30).toString("hex")
  await prisma.emailVerificationToken.create({
    data: { email, user_id: profile.id, token },
  })

  try {
    await sendVerificationEmail(email, token)
  } catch (e) {
    console.error("Failed to resend verification email:", e)
  }

  return { success: "Verification email resent. Please check your inbox." }
}
