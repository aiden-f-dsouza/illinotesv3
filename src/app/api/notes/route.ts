import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db/prisma"
import { getFilteredNotes } from "@/lib/notes/queries"
import { PAGE_SIZE } from "@/lib/utils"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Feed gate: user must have posted at least one note
  const hasPosted = await prisma.note.findFirst({
    where: { user_id: user.id },
    select: { id: true },
  })
  if (!hasPosted) {
    return NextResponse.json({ error: "Post a note to unlock the feed" }, { status: 403 })
  }

  const { searchParams } = request.nextUrl
  const filters = {
    class_filter: searchParams.get("class_filter") || "All",
    search: searchParams.get("search") || "",
    tag_filter: searchParams.get("tag_filter") || "All",
    date_filter: searchParams.get("date_filter") || "All",
    sort_by: searchParams.get("sort_by") || "recent",
    page: parseInt(searchParams.get("page") || "1"),
  }

  const { notes, hasMore, total } = await getFilteredNotes(filters)

  // Fetch comments for each note
  const noteIds = notes.map((n) => n.id)
  const comments = await prisma.comment.findMany({
    where: { note_id: { in: noteIds } },
    orderBy: { id: "asc" },
  })

  const commentsByNote: Record<number, any[]> = {}
  for (const c of comments) {
    if (!commentsByNote[c.note_id]) commentsByNote[c.note_id] = []
    commentsByNote[c.note_id].push({
      ...c,
      created: c.created.toISOString(),
    })
  }

  const notesWithComments = notes.map((n) => ({
    ...n,
    comments: commentsByNote[n.id] || [],
  }))

  return NextResponse.json({
    notes: notesWithComments,
    hasMore,
    total,
    page: filters.page,
    pageSize: PAGE_SIZE,
  })
}
