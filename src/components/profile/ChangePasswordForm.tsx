"use client"

import { useActionState } from "react"
import { changePasswordAction } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState = { error: undefined, success: undefined }

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300 rounded-lg text-sm">
          {state.success}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1.5">Current password</label>
        <Input name="currentPassword" type="password" required autoComplete="current-password" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">New password</label>
        <Input name="newPassword" type="password" minLength={8} required autoComplete="new-password" />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white"
      >
        {isPending ? "Updating…" : "Update password"}
      </Button>
    </form>
  )
}
