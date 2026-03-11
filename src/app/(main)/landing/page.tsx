import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db/prisma"
import { ArrowRight, BookOpen, Brain, Users, Star, Lock } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IlliNotes — Collaborative Notes for UIUC",
  description: "Share and discover class notes with fellow University of Illinois students.",
}

async function getStats() {
  const [noteCount, userCount] = await Promise.all([
    prisma.note.count(),
    prisma.note.groupBy({ by: ["user_id"] }).then((g: { user_id: string }[]) => g.length),
  ])
  return { noteCount, userCount }
}

async function getRecentNotes() {
  const notes = await prisma.note.findMany({
    orderBy: { created: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      author: true,
      class_code: true,
      body: true,
      created: true,
      _count: { select: { likes: true, comments: true } },
    },
  })
  return notes
}

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [stats, recentNotes] = await Promise.all([getStats(), getRecentNotes()])

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-campus-background.png"
            alt="UIUC Campus"
            fill
            className="object-cover opacity-15 dark:opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--paper)]/60 via-[var(--paper)]/80 to-[var(--paper)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--terracotta)]/10 border border-[var(--terracotta)]/20 text-[var(--terracotta)] text-sm font-medium mb-6">
            <Star size={13} weight="fill" />
            Built exclusively for UIUC students
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Share notes,{" "}
            <span className="text-[var(--terracotta)]">ace</span>{" "}
            your classes
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            IlliNotes is where UIUC students share class notes, collaborate on coursework,
            and get AI-powered study help — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Link href="/notes">
                <Button size="lg" className="gap-2 bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] text-white hover:opacity-90 text-base px-8">
                  Go to Notes Feed
                  <ArrowRight size={18} weight="bold" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="gap-2 bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] text-white hover:opacity-90 text-base px-8">
                    Get started free
                    <ArrowRight size={18} weight="bold" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="text-base px-8">
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 text-center">
            <div>
              <p className="font-serif text-3xl font-bold text-[var(--terracotta)]">
                {stats.noteCount.toLocaleString()}+
              </p>
              <p className="text-sm text-muted-foreground">Notes shared</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="font-serif text-3xl font-bold text-[var(--terracotta)]">
                {stats.userCount.toLocaleString()}+
              </p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="font-serif text-3xl font-bold text-[var(--terracotta)]">350+</p>
              <p className="text-sm text-muted-foreground">Courses covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="font-serif text-3xl font-bold text-center mb-12">
          Everything you need to study smarter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: <BookOpen size={24} className="text-[var(--terracotta)]" weight="bold" />,
              title: "Shared Notes",
              desc: "Browse thousands of notes across 350+ UIUC courses. Filter by class, date, tags, or search.",
            },
            {
              icon: <Brain size={24} className="text-[var(--ochre)]" weight="bold" />,
              title: "AI Tutor",
              desc: "Ask your personal AI tutor questions about any note. Context-aware answers powered by GPT-4o-mini.",
            },
            {
              icon: <Users size={24} className="text-[var(--sage)]" weight="bold" />,
              title: "Collaboration",
              desc: "Like notes, leave comments, @mention classmates, and build a community around shared knowledge.",
            },
            {
              icon: <Lock size={24} className="text-[var(--indigo-brand)]" weight="bold" />,
              title: "Give to Get",
              desc: "Share one note to unlock the entire feed. This keeps content quality high for everyone.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--paper-dark)] flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent notes preview */}
      {recentNotes.length > 0 && (
        <section className="bg-[var(--paper-dark)] border-t border-b border-border py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="font-serif text-2xl font-bold text-center mb-8">
              Recently shared notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-card border border-border rounded-xl p-4 shadow-[var(--shadow-sm)] note-card-accent"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif font-bold text-sm line-clamp-2 flex-1">{note.title}</h3>
                    <span className="text-xs font-mono bg-[var(--indigo-brand)]/10 text-[var(--indigo-brand)] px-2 py-0.5 rounded-full shrink-0">
                      {note.class_code}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{note.body}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{note.author}</span>
                    <span>·</span>
                    <span>❤️ {note._count.likes}</span>
                    <span>·</span>
                    <span>💬 {note._count.comments}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href={user ? "/notes" : "/signup"}>
                <Button className="gap-2 bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white">
                  {user ? "Browse all notes" : "Sign up to see more"}
                  <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {!user && (
        <section className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Ready to study smarter?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of UIUC students already sharing notes on IlliNotes.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2 bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] text-white hover:opacity-90 text-base px-10">
              Create your free account
              <ArrowRight size={18} weight="bold" />
            </Button>
          </Link>
        </section>
      )}
    </div>
  )
}
