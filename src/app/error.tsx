"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="font-serif text-6xl font-bold text-[var(--terracotta)] mb-4">Oops</p>
        <h1 className="font-serif text-2xl font-bold mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <Button
          onClick={reset}
          className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}
