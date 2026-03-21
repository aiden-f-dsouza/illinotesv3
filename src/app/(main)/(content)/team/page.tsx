import type { Metadata } from "next"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Linkedin, Github, Mail } from "lucide-react"

export const metadata: Metadata = { title: "Team" }

export default function TeamPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-2">Meet the Team</h1>
      <p className="text-muted-foreground mb-10">The students behind Illinotes.</p>

      <div className="flex justify-center">
        <div className="bg-card border border-border rounded-xl p-8 shadow-[var(--shadow-sm)] max-w-sm w-full text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl bg-[var(--terracotta)] text-white font-semibold">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="font-serif text-xl font-bold mb-4">Aiden D&apos;Souza</h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.linkedin.com/in/aidenfdsouza/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[var(--terracotta)] transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://github.com/aiden-f-dsouza/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[var(--terracotta)] transition-colors"
              title="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="mailto:aidenfd2@illinois.edu"
              className="text-muted-foreground hover:text-[var(--terracotta)] transition-colors"
              title="Email"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-card border border-border rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold mb-3">Help Us Grow</h2>
        <p className="text-muted-foreground mb-6">
          Illinotes is built by students, for students. Join our community and help make learning better for everyone.
        </p>
        <Link
          href="/support"
          className="inline-block bg-[var(--terracotta)] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get in Touch
        </Link>
      </div>

      <p className="mt-8 text-muted-foreground text-sm text-center">
        Thank you to Sriram, Ammar, and CS124 Honors Group 10
      </p>
    </div>
  )
}
