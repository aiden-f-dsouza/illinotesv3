"use client"

import { useActionState } from "react"
import { loginAction } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const initialState = { error: undefined, success: undefined }

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/landing" className="inline-block">
            <h1 className="font-serif text-3xl font-bold text-[var(--terracotta)]">Illinotes</h1>
            <p className="text-muted-foreground text-sm mt-1">Share knowledge, ace your classes</p>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-[var(--shadow-md)]">
          <h2 className="font-serif text-2xl font-bold mb-6">Sign in</h2>

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
              <label htmlFor="identifier" className="block text-sm font-medium mb-1.5">
                Email or username
              </label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="you@illinois.edu or your_username"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--terracotta)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white"
              disabled={isPending}
            >
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--terracotta)] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
