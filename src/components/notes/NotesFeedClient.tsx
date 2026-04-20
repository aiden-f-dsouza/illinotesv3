"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NoteList } from "./NoteList"
import { FeedGateOverlay } from "./FeedGateOverlay"
import { CreateNoteModal } from "./CreateNoteModal"
import { TagCloud } from "./TagCloud"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  NotePencil,
  MagnifyingGlass,
  Notebook,
  HandWaving,
  Star,
  X,
} from "@phosphor-icons/react"
import type { NoteWithCounts, UserWithProfile, TagCount } from "@/types"
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
  tags: TagCount[]
  total: number
  displayName: string | null
}

export function NotesFeedClient({
  initialNotes,
  hasMore,
  hasPosted,
  currentUser,
  likedNoteIds,
  subjects,
  coursesDict,
  searchParams: initialParams,
  tags,
  total,
  displayName,
}: Props) {
  const [createOpen, setCreateOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentClass = searchParams.get("class_filter") || "All"
  const currentTag = searchParams.get("tag_filter") || "All"
  const currentDate = searchParams.get("date_filter") || "All"
  const currentSort = searchParams.get("sort_by") || "recent"

  // Derive selected subject from the current class filter
  const derivedSubject =
    currentClass !== "All" && !/\d/.test(currentClass)
      ? currentClass
      : currentClass !== "All" && /\d/.test(currentClass)
      ? currentClass.replace(/\d.*$/, "")
      : ""

  const [selectedSubject, setSelectedSubject] = useState(derivedSubject)

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, val] of Object.entries(updates)) {
      if (val === "All" || val === "") {
        params.delete(key)
      } else {
        params.set(key, val)
      }
    }
    params.delete("page")
    startTransition(() => router.push(`/notes?${params.toString()}`))
  }

  function clearFilters() {
    setSelectedSubject("")
    startTransition(() => router.push("/notes"))
  }

  const isTopActive = currentSort === "most_liked"

  const dateLabel: Record<string, string> = {
    All: "All Time",
    Today: "Today",
    Week: "This Week",
    Month: "This Month",
  }
  const sortLabel: Record<string, string> = {
    recent: "Most Recent",
    oldest: "Oldest First",
    most_liked: "Most Liked",
    most_commented: "Most Commented",
    title: "Title A–Z",
  }

  const hasFilters =
    currentClass !== "All" ||
    currentTag !== "All" ||
    currentDate !== "All" ||
    currentSort !== "recent"

  // Derive the current course number value for the number dropdown
  const currentCourseNumber =
    currentClass !== "All" && /\d/.test(currentClass) && currentClass.startsWith(selectedSubject)
      ? currentClass
      : "All"

  return (
    <div>
      {/* Greeting */}
      <div className="mb-5 flex items-center gap-3">
        <HandWaving size={28} weight="duotone" className="text-[var(--terracotta)] shrink-0" />
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">
          Welcome to Illinotes{displayName ? `, ${displayName}` : ""}!
        </h1>
      </div>

      {/* Share Your Notes banner */}
      {currentUser && (
        <div className="rounded-xl border border-border bg-[var(--paper-dark)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 font-medium text-sm">
            <NotePencil size={16} weight="duotone" className="text-[var(--terracotta)]" />
            Share Your Notes
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white font-semibold shrink-0"
          >
            Add Note +
          </Button>
        </div>
      )}

      {/* Find Your Course */}
      <div className="rounded-xl border border-border bg-[var(--paper-dark)] p-4 mb-4">
        <p className="text-sm font-semibold mb-3 flex items-center gap-2">
          <MagnifyingGlass size={15} className="text-muted-foreground" />
          Find Your Course
        </p>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => {
              const val = e.target.value
              setSelectedSubject(val)
              updateParams({ class_filter: val || "All" })
            }}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm hover:border-[var(--terracotta)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 text-foreground"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={currentCourseNumber === "All" ? "" : currentCourseNumber}
            onChange={(e) => {
              const val = e.target.value
              updateParams({ class_filter: val || selectedSubject || "All" })
            }}
            disabled={!selectedSubject}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm hover:border-[var(--terracotta)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
          >
            <option value="">All Numbers</option>
            {(coursesDict[selectedSubject] || []).map((num) => (
              <option key={num} value={`${selectedSubject}${num}`}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posted Notes controls */}
      <div className="rounded-xl border border-border bg-[var(--paper-dark)] p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-2 font-serif font-bold mr-auto">
            <Notebook size={16} className="text-muted-foreground" />
            Posted Notes
          </div>

          <span className="text-xs text-muted-foreground bg-background rounded-full px-2.5 py-0.5 border border-border whitespace-nowrap">
            {total} {total === 1 ? "note" : "notes"}
          </span>

          <Select
            value={currentDate}
            onValueChange={(v) => updateParams({ date_filter: v ?? "All" })}
          >
            <SelectTrigger className="min-w-[110px] bg-background text-sm h-8 px-3">
              <span>{dateLabel[currentDate] ?? "All Time"}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Time</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Week">This Week</SelectItem>
              <SelectItem value="Month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currentSort}
            onValueChange={(v) => updateParams({ sort_by: v ?? "recent" })}
          >
            <SelectTrigger className="min-w-[140px] bg-background text-sm h-8 px-3">
              <span>{sortLabel[currentSort] ?? "Most Recent"}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most_liked">Most Liked</SelectItem>
              <SelectItem value="most_commented">Most Commented</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={isTopActive ? "default" : "outline"}
            size="sm"
            onClick={() => updateParams({ sort_by: isTopActive ? "recent" : "most_liked" })}
            className={`h-8 gap-1.5 ${
              isTopActive
                ? "bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white border-transparent"
                : "text-muted-foreground"
            }`}
          >
            <Star size={13} weight={isTopActive ? "fill" : "regular"} />
            Top
          </Button>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-muted-foreground h-8"
            >
              <X size={13} />
              Clear Filters
            </Button>
          )}
        </div>

        {tags.length > 0 && (
          <TagCloud
            tags={tags}
            selectedTag={currentTag}
            onSelect={(tag) => updateParams({ tag_filter: tag })}
          />
        )}
      </div>

      {/* Feed gate or notes list */}
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
          searchParams={initialParams}
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
