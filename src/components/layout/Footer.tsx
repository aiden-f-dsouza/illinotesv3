import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-[var(--paper-dark)] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <span className="font-serif font-bold text-[var(--terracotta)]">IlliNotes</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Collaborative note-sharing for UIUC students
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/forum" className="hover:text-foreground transition-colors">Forum</Link>
            <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
            <Link href="/philosophy" className="hover:text-foreground transition-colors">Philosophy</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </nav>
        </div>
        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} IlliNotes. Built for the Fighting Illini.
        </div>
      </div>
    </footer>
  )
}
