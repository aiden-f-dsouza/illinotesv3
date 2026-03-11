import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="font-serif text-8xl font-bold text-[var(--terracotta)] mb-4">404</p>
        <h1 className="font-serif text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          This page doesn&apos;t exist — but there are plenty of great notes that do.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/notes">
            <Button className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white">
              Browse Notes
            </Button>
          </Link>
          <Link href="/landing">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
