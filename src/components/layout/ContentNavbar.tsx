import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ContentNavbar() {
  return (
    <header className="sticky top-0 z-[1000] bg-[var(--paper)]/80 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/landing" className="shrink-0">
          <span className="font-serif font-bold text-xl lowercase text-[var(--terracotta)] tracking-tight">
            illinotes
          </span>
        </Link>

        {/* Right side: glowing Share Notes CTA */}
        <Link href="/notes">
          <Button
            size="sm"
            className="border-0 bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta)]/90 [box-shadow:0_0_24px_4px_color-mix(in_srgb,var(--terracotta)_40%,transparent)]"
          >
            Share Notes
          </Button>
        </Link>
      </div>
    </header>
  )
}
