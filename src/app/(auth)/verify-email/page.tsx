import { verifyEmailAction } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] px-4">
        <div className="w-full max-w-md text-center bg-card border border-border rounded-xl p-8 shadow-[var(--shadow-md)]">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="font-serif text-2xl font-bold mb-3">Invalid link</h2>
          <p className="text-muted-foreground mb-6">No verification token found.</p>
          <Link href="/signup"><Button variant="outline">Back to Sign Up</Button></Link>
        </div>
      </div>
    )
  }

  const result = await verifyEmailAction(token)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] px-4">
      <div className="w-full max-w-md text-center bg-card border border-border rounded-xl p-8 shadow-[var(--shadow-md)]">
        {result.error ? (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="font-serif text-2xl font-bold mb-3">Verification failed</h2>
            <p className="text-muted-foreground mb-6">{result.error}</p>
            <Link href="/signup"><Button variant="outline">Back to Sign Up</Button></Link>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-serif text-2xl font-bold mb-3">Email verified!</h2>
            <p className="text-muted-foreground mb-6">{result.success}</p>
            <Link href="/login">
              <Button className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white">
                Sign in
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
