import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Forum" }

export default function ForumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🏛️</div>
      <h1 className="font-serif text-3xl font-bold mb-4">Community Forum</h1>
      <p className="text-muted-foreground text-lg mb-2">Coming soon.</p>
      <p className="text-muted-foreground mb-8">
        A discussion board for UIUC students to ask questions, share resources, and connect with classmates beyond notes.
      </p>
      <Link href="/notes">
        <Button className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white">
          Browse Notes in the meantime
        </Button>
      </Link>
    </div>
  )
}
