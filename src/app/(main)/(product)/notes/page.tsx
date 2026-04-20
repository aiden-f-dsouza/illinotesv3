import { Suspense } from "react"
import { getUserWithProfile } from "@/lib/auth/server"
import { getFilteredNotes, getUserVotes, getTagCloud, userHasPosted } from "@/lib/notes/queries"
import { prisma } from "@/lib/db/prisma"
import { COURSES_DICT, SUBJECTS } from "@/lib/courses/loader"
import { NotesFeedClient } from "@/components/notes/NotesFeedClient"
import NotesLoading from "./loading"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Notes Feed" }
export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<Record<string, string>>
}

export default async function NotesPage({ searchParams }: Props) {
  const params = await searchParams
  const user = await getUserWithProfile()

  const filters = {
    class_filter: params.class_filter || "All",
    search: params.search || "",
    tag_filter: params.tag_filter || "All",
    date_filter: params.date_filter || "All",
    sort_by: params.sort_by || "recent",
    page: 1,
  }

  const hasPosted = user ? await userHasPosted(user.id) : false

  // Always fetch data (even for gated users — server renders it, gate overlay hides it)
  const [{ notes, hasMore, total }, tags, votesMap] = await Promise.all([
    getFilteredNotes(filters),
    getTagCloud(),
    user ? getUserVotes(user.id) : Promise.resolve(new Map<number, number>()),
  ])

  // Fetch comments for initial notes
  const noteIds = notes.map((n) => n.id)
  const comments = await prisma.comment.findMany({
    where: { note_id: { in: noteIds } },
    orderBy: { id: "asc" },
  })
  const commentsByNote: Record<number, any[]> = {}
  for (const c of comments) {
    if (!commentsByNote[c.note_id]) commentsByNote[c.note_id] = []
    commentsByNote[c.note_id].push({ ...c, created: c.created.toISOString() })
  }

  const notesWithComments = notes.map((n) => ({
    ...n,
    comments: commentsByNote[n.id] || [],
  }))

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Suspense fallback={<NotesLoading />}>
        <NotesFeedClient
          initialNotes={notesWithComments}
          hasMore={hasMore}
          hasPosted={hasPosted}
          currentUser={user}
          userVotes={Object.fromEntries(votesMap)}
          subjects={SUBJECTS}
          coursesDict={COURSES_DICT}
          searchParams={params}
          tags={tags}
          total={total}
          displayName={user?.displayName || user?.username || null}
        />
      </Suspense>
    </div>
  )
}
