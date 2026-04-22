"use client"

import { useActionState } from "react"
import { resetPasswordAction } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const initialState = { error: undefined, success: undefined }

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState)

  if (state?.success) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-serif text-2xl font-bold mb-3">Password reset!</h2>
        <p className="text-muted-foreground mb-6">{state.success}</p>
        <Link href="/login">
          <Button className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white">
            Sign in
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2 className="font-serif text-2xl font-bold mb-6">Set new password</h2>
      {state?.error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            New password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            minLength={8}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white"
          disabled={isPending || !token}
        >
          {isPending ? "Resetting…" : "Reset password"}
        </Button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/landing" className="inline-block">
            <h1 className="font-serif text-3xl font-bold text-[var(--terracotta)]">Illinotes</h1>
          </Link>
        </div>
        <div className="bg-card border border-border rounded-xl p-8 shadow-[var(--shadow-md)]">
          <Suspense fallback={<div>Loading…</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
