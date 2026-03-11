"use client"

import { useState } from "react"
import { NoteList } from "./NoteList"
import { FeedGateOverlay } from "./FeedGateOverlay"
import { CreateNoteModal } from "./CreateNoteModal"
import { Button } from "@/components/ui/button"
import { NotePencil } from "@phosphor-icons/react"
import type { NoteWithCounts, UserWithProfile } from "@/types"
import type { Comment } from "@/types"

interface NoteWithComments extends NoteWithCounts {
  comments: Comment[]
}

interface Props {
  initialNotes: NoteWithComments[]
  hasMore: boolean
  hasPosted: boolean
  currentUser: UserWithProfile | null
  likedNoteIds: number[]
  subjects: string[]
  coursesDict: Record<string, number[]>
  searchParams: Record<string, string>
}

export function NotesFeedClient({
  initialNotes,
  hasMore,
  hasPosted,
  currentUser,
  likedNoteIds,
  subjects,
  coursesDict,
  searchParams,
}: Props) {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-serif text-2xl font-bold">Notes Feed</h1>
        {currentUser && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] text-white hover:opacity-90 font-semibold"
          >
            <NotePencil size={16} weight="bold" />
            Share note
          </Button>
        )}
      </div>

      {/* Feed gate or actual notes */}
      {currentUser && !hasPosted ? (
        <FeedGateOverlay onCreateNote={() => setCreateOpen(true)} />
      ) : (
        <NoteList
          initialNotes={initialNotes}
          hasMore={hasMore}
          currentUserId={currentUser?.id}
          isAdmin={currentUser?.isAdmin}
          likedNoteIds={likedNoteIds}
          subjects={subjects}
          coursesDict={coursesDict}
          searchParams={searchParams}
        />
      )}

      <CreateNoteModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        subjects={subjects}
        coursesDict={coursesDict}
        onSuccess={() => setCreateOpen(false)}
      />
    </div>
  )
}
