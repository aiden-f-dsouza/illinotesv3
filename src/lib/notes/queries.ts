import { prisma } from "@/lib/db/prisma"
import type { NoteFilters, NoteWithCounts } from "@/types"
import { PAGE_SIZE } from "@/lib/utils"

export async function getFilteredNotes(
  filters: NoteFilters
): Promise<{ notes: NoteWithCounts[]; hasMore: boolean; total: number }> {
  const {
    class_filter = "All",
    search = "",
    tag_filter = "All",
    date_filter = "All",
    sort_by = "recent",
    page = 1,
  } = filters

  const where: any = {}

  // Class filter
  if (class_filter && class_filter !== "All") {
    if (/^[A-Z]+\d/.test(class_filter)) {
      where.class_code = class_filter
    } else {
      where.class_code = { startsWith: class_filter }
    }
  }

  // Search
  if (search.trim()) {
    const s = search.trim()
    where.OR = [
      { title: { contains: s, mode: "insensitive" } },
      { body: { contains: s, mode: "insensitive" } },
      { author: { contains: s, mode: "insensitive" } },
    ]
  }

  // Tag filter
  if (tag_filter && tag_filter !== "All") {
    where.tags = { contains: tag_filter, mode: "insensitive" }
  }

  // Date filter
  if (date_filter && date_filter !== "All") {
    const now = new Date()
    let cutoff: Date | null = null
    if (date_filter === "Today") {
      cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    } else if (date_filter === "Week") {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (date_filter === "Month") {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
    if (cutoff) where.created = { gte: cutoff }
  }

  // Sort
  let orderBy: any = { id: "desc" }
  if (sort_by === "oldest") orderBy = { id: "asc" }
  else if (sort_by === "title") orderBy = { title: "asc" }
  else if (sort_by === "author") orderBy = { author: "asc" }
  else if (sort_by === "most_liked") orderBy = { score: "desc" }
  else if (sort_by === "most_commented") orderBy = { comments: { _count: "desc" } }
  else if (sort_by === "popular") {
    // Prisma doesn't support computed sort directly; fall back to recent
    orderBy = { id: "desc" }
  }

  const skip = (page - 1) * PAGE_SIZE

  const [total, rawNotes] = await Promise.all([
    prisma.note.count({ where }),
    prisma.note.findMany({
      where,
      orderBy,
      skip,
      take: PAGE_SIZE,
      include: {
        attachments: true,
        _count: { select: { comments: true } },
      },
    }),
  ])

  const notes: NoteWithCounts[] = rawNotes.map((n) => ({
    ...n,
    created: n.created.toISOString(),
    attachments: n.attachments.map((a) => ({
      ...a,
      uploaded_at: a.uploaded_at.toISOString(),
      extracted_text: a.extracted_text ?? null,
    })),
  }))

  return {
    notes,
    hasMore: skip + notes.length < total,
    total,
  }
}

export async function getUserVotes(userId: string): Promise<Map<number, number>> {
  const votes = await prisma.vote.findMany({
    where: { user_id: userId },
    select: { note_id: true, value: true },
  })
  return new Map(votes.map((v) => [v.note_id, v.value]))
}

export async function getTagCloud(): Promise<Array<{ tag: string; count: number }>> {
  const notes = await prisma.note.findMany({
    select: { tags: true },
    where: { tags: { not: null } },
  })

  const counts: Record<string, number> = {}
  for (const note of notes) {
    if (!note.tags) continue
    const tags = note.tags.split(",").map((t) => t.trim()).filter(Boolean)
    for (const tag of tags) {
      counts[tag] = (counts[tag] || 0) + 1
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([tag, count]) => ({ tag, count }))
}

export async function userHasPosted(userId: string): Promise<boolean> {
  const note = await prisma.note.findFirst({ where: { user_id: userId }, select: { id: true } })
  return !!note
}
