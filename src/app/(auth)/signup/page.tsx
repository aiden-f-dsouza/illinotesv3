"use client"

import { useActionState } from "react"
import { signupAction } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const initialState = { error: undefined, success: undefined }

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState)

  if (state?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-card border border-border rounded-xl p-8 shadow-[var(--shadow-md)]">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="font-serif text-2xl font-bold mb-3">Check your email</h2>
            <p className="text-muted-foreground mb-6">{state.success}</p>
            <Link href="/login">
              <Button variant="outline" className="w-full">Go to Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/landing" className="inline-block">
            <h1 className="font-serif text-3xl font-bold text-[var(--terracotta)]">Illinotes</h1>
            <p className="text-muted-foreground text-sm mt-1">Join thousands of UIUC students</p>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-[var(--shadow-md)]">
          <h2 className="font-serif text-2xl font-bold mb-6">Create account</h2>

          {state?.error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@illinois.edu"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1.5">
                Username
                <span className="text-muted-foreground font-normal ml-1">(3–20 chars, used for @mentions)</span>
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="yourname"
                autoComplete="username"
                pattern="[a-zA-Z0-9_]{3,20}"
                required
              />
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-1.5">
                Display name
              </label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Your Name"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
                <span className="text-muted-foreground font-normal ml-1">(min 8 characters)</span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white"
              disabled={isPending}
            >
              {isPending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--terracotta)] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
