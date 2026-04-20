import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db/prisma"
import { ArrowRight, ArrowFatUp, ChatTeardropText } from "@phosphor-icons/react/dist/ssr"
import { FeaturesCarousel } from "@/components/landing/FeaturesCarousel"
import { ComparisonTable } from "@/components/landing/ComparisonTable"
import { HeroSection } from "@/components/landing/HeroSection"
import { FadeInView } from "@/components/landing/FadeInView"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IlliNotes — Collaborative Notes for UIUC",
  description: "Share and discover class notes with fellow University of Illinois students.",
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
      score: true,
      _count: { select: { comments: true } },
    },
  })
  return notes
}

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const recentNotes = await getRecentNotes()

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* ── Hero + Mockup ── */}
      <HeroSection />

      {/* ── Features Carousel ── */}
      <section className="py-20 bg-gradient-to-b from-[var(--paper)] to-[var(--paper-dark)]/30">
        <FadeInView className="max-w-5xl mx-auto px-4 mb-10">
          <h2 className="font-serif text-4xl font-bold text-center">
            Everything you need
          </h2>
          <p className="text-muted-foreground text-center mt-3 max-w-xl mx-auto">
            A complete toolkit for studying smarter at UIUC — not just a note dump.
          </p>
        </FadeInView>
        <FadeInView delay={0.1}>
          <FeaturesCarousel />
        </FadeInView>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-20 bg-gradient-to-b from-[var(--paper-dark)]/30 via-[var(--paper-dark)]/50 to-[var(--paper-dark)]/30">
        <div className="max-w-4xl mx-auto px-4">
          <FadeInView>
            <h2 className="font-serif text-4xl font-bold text-center mb-3">
              Why Illinotes Wins
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              Other tools solve pieces of the puzzle. Illinotes was built for exactly this.
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <ComparisonTable />
          </FadeInView>
        </div>
      </section>

      {/* ── Recent Notes Preview ── */}
      {recentNotes.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-[var(--paper-dark)]/30 to-[var(--paper)]">
          <div className="max-w-5xl mx-auto px-4">
            <FadeInView>
              <h2 className="font-serif text-3xl font-bold text-center mb-8">
                Recently shared notes
              </h2>
            </FadeInView>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentNotes.map((note, index) => (
                <FadeInView key={note.id} delay={index * 0.1}>
                <div
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
                    <span className="flex items-center gap-1">
                      <ArrowFatUp size={12} className="text-muted-foreground" />
                      {note.score}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <ChatTeardropText size={12} />
                      {note._count.comments}
                    </span>
                  </div>
                </div>
                </FadeInView>
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

      {/* ── CTA ── */}
      {!user && (
        <section className="bg-gradient-to-b from-[var(--paper)] to-[var(--paper-dark)]/40">
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <FadeInView>
            <h2 className="font-serif text-4xl font-bold mb-4">Ready to study smarter?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of UIUC students already sharing notes on IlliNotes.
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] text-white hover:opacity-90 text-base px-10 h-12">
                Create your free account
                <ArrowRight size={18} weight="bold" />
              </Button>
            </Link>
          </FadeInView>
          </div>
        </section>
      )}
    </div>
  )
}
