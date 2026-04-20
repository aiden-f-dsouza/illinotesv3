"use client"

import { useState, useEffect, useTransition } from "react"
import { NoteCard } from "./NoteCard"
import { EditNoteModal } from "./EditNoteModal"
import { Button } from "@/components/ui/button"
import type { NoteWithCounts } from "@/types"
import type { Comment } from "@/types"
import { ArrowDown } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"

interface NoteWithComments extends NoteWithCounts {
  comments: Comment[]
}

interface Props {
  initialNotes: NoteWithComments[]
  hasMore: boolean
  currentUserId?: string
  isAdmin?: boolean
  userVotes: Record<number, number>
  subjects: string[]
  coursesDict: Record<string, number[]>
  onAskAI?: (note: NoteWithCounts) => void
  searchParams: Record<string, string>
}

export function NoteList({
  initialNotes,
  hasMore: initialHasMore,
  currentUserId,
  isAdmin,
  userVotes,
  subjects,
  coursesDict,
  onAskAI,
  searchParams,
}: Props) {
  const [notes, setNotes] = useState<NoteWithComments[]>(initialNotes)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [editingNote, setEditingNote] = useState<NoteWithCounts | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setNotes(initialNotes)
    setHasMore(initialHasMore)
    setPage(1)
  }, [initialNotes, initialHasMore])


  function loadMore() {
    const nextPage = page + 1
    const params = new URLSearchParams(searchParams)
    params.set("page", String(nextPage))

    startTransition(async () => {
      const res = await fetch(`/api/notes?${params.toString()}`)
      if (!res.ok) return
      const data = await res.json()
      setNotes((prev) => [...prev, ...data.notes])
      setHasMore(data.hasMore)
      setPage(nextPage)
    })
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No notes found. Be the first to share!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notes.map((note, i) => (
            <NoteCard
              key={note.id}
              note={note}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              userVote={userVotes[note.id] ?? null}
              index={i}
              onEdit={setEditingNote}
              onAskAI={onAskAI}
            />
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isPending}
            className="gap-2"
          >
            <ArrowDown size={15} />
            {isPending ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}

      <EditNoteModal
        note={editingNote}
        onClose={() => setEditingNote(null)}
        subjects={subjects}
        coursesDict={coursesDict}
      />
    </div>
  )
}
