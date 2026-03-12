import Link from "next/link"
import { ShieldWarning } from "@phosphor-icons/react/dist/ssr"

export function Footer() {
  return (
    <footer className="bg-[#1C1A18] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif font-bold text-xl lowercase text-[var(--terracotta)] tracking-tight">
              illinotes
            </span>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/notes" className="hover:text-white transition-colors">Notes Feed</Link></li>
              <li><Link href="/summarizer" className="hover:text-white transition-colors">AI Tutor</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/philosophy" className="hover:text-white transition-colors">Philosophy</Link></li>
              <li><Link href="/team" className="hover:text-white transition-colors">Team</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/support" className="hover:text-white transition-colors">Help &amp; Support</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10" />

        {/* Academic integrity disclaimer */}
        <div className="mt-6 flex items-start gap-3 text-xs text-white/40">
          <ShieldWarning size={16} className="shrink-0 mt-0.5 text-[var(--terracotta)]/60" />
          <p>
            Illinotes is for sharing study notes and educational resources only. Please do not upload exam answers,
            solutions to graded assignments, or any material that violates your institution&apos;s academic integrity policy.
          </p>
        </div>
      </div>
    </footer>
  )
}
