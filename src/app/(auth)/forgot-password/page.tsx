"use client"

import { useActionState } from "react"
import { forgotPasswordAction } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const initialState = { error: undefined, success: undefined }

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/landing" className="inline-block">
            <h1 className="font-serif text-3xl font-bold text-[var(--terracotta)]">Illinotes</h1>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-[var(--shadow-md)]">
          <h2 className="font-serif text-2xl font-bold mb-2">Reset password</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {state?.error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300 rounded-lg text-sm">
              {state.success}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
              <Input id="email" name="email" type="email" placeholder="you@illinois.edu" required />
            </div>
            <Button
              type="submit"
              className="w-full bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white"
              disabled={isPending}
            >
              {isPending ? "Sending…" : "Send reset link"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link href="/login" className="text-[var(--terracotta)] font-medium hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
