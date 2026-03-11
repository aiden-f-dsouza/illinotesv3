"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { NotePencil, Lock } from "@phosphor-icons/react"

interface Props {
  onCreateNote: () => void
}

export function FeedGateOverlay({ onCreateNote }: Props) {
  return (
    <div className="relative">
      {/* Blurred placeholder cards */}
      <div className="space-y-4 select-none pointer-events-none" aria-hidden>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-5 blur-sm opacity-60 note-card-accent"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="h-5 bg-muted rounded w-48 mb-2" />
                <div className="h-3.5 bg-muted rounded w-24" />
              </div>
              <div className="h-6 bg-muted rounded-full w-14" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 bg-muted rounded w-full" />
              <div className="h-3.5 bg-muted rounded w-5/6" />
              <div className="h-3.5 bg-muted rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>

      {/* Overlay CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl p-8 shadow-[var(--shadow-lg)] text-center max-w-sm mx-4">
          <div className="w-14 h-14 bg-[var(--terracotta)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-[var(--terracotta)]" weight="bold" />
          </div>
          <h3 className="font-serif text-xl font-bold mb-2">Share to unlock the feed</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Post your first note to gain access to thousands of class notes shared by fellow UIUC students.
          </p>
          <Button
            onClick={onCreateNote}
            className="w-full bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] hover:opacity-90 text-white font-semibold gap-2"
          >
            <NotePencil size={16} weight="bold" />
            Share your first note
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
