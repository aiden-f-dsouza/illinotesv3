"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MagnifyingGlass, X } from "@phosphor-icons/react"
import { TagCloud } from "./TagCloud"
import type { TagCount } from "@/types"

interface Props {
  subjects: string[]
  coursesDict: Record<string, number[]>
  tags: TagCount[]
}

export function NoteFilters({ subjects, coursesDict, tags }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentClass = searchParams.get("class_filter") || "All"
  const currentSearch = searchParams.get("search") || ""
  const currentTag = searchParams.get("tag_filter") || "All"
  const currentDate = searchParams.get("date_filter") || "All"
  const currentSort = searchParams.get("sort_by") || "recent"

  const [search, setSearch] = useState(currentSearch)

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ search })
  }

  function clearFilters() {
    setSearch("")
    startTransition(() => router.push("/notes"))
  }

  const hasFilters =
    currentClass !== "All" ||
    currentSearch !== "" ||
    currentTag !== "All" ||
    currentDate !== "All" ||
    currentSort !== "recent"

  // Subject + course filter
  const [selectedSubject, setSelectedSubject] = useState(
    currentClass !== "All" && !/\d/.test(currentClass) ? currentClass : ""
  )

  return (
    <div className="bg-[var(--paper-dark)] border border-border rounded-xl p-4 space-y-3">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={15}
            className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="pl-8 bg-background"
          />
        </div>
        <Button type="submit" size="sm" className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white">
          Search
        </Button>
      </form>

      {/* Row 2: Subject → Course, Date, Sort */}
      <div className="flex flex-wrap gap-2">
        {/* Subject */}
        <Select
          value={selectedSubject || "All"}
          onValueChange={(v) => {
            const val = v ?? "All"
            setSelectedSubject(val === "All" ? "" : val)
            updateParams({ class_filter: val })
          }}
        >
          <SelectTrigger className="w-32 bg-background text-sm h-9">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Course (only if subject selected) */}
        {selectedSubject && (
          <Select
            value={currentClass.includes(selectedSubject) && /\d/.test(currentClass) ? currentClass : "All"}
            onValueChange={(v) => updateParams({ class_filter: v ?? "All" })}
          >
            <SelectTrigger className="w-32 bg-background text-sm h-9">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All {selectedSubject}</SelectItem>
              {(coursesDict[selectedSubject] || []).map((num) => (
                <SelectItem key={num} value={`${selectedSubject}${num}`}>
                  {selectedSubject}{num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date */}
        <Select
          value={currentDate}
          onValueChange={(v) => updateParams({ date_filter: v ?? "All" })}
        >
          <SelectTrigger className="w-32 bg-background text-sm h-9">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All time</SelectItem>
            <SelectItem value="Today">Today</SelectItem>
            <SelectItem value="Week">This week</SelectItem>
            <SelectItem value="Month">This month</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={currentSort}
          onValueChange={(v) => updateParams({ sort_by: v ?? "recent" })}
        >
          <SelectTrigger className="w-36 bg-background text-sm h-9">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="most_liked">Most liked</SelectItem>
            <SelectItem value="most_commented">Most commented</SelectItem>
            <SelectItem value="title">Title A–Z</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 text-muted-foreground h-9"
          >
            <X size={13} />
            Clear
          </Button>
        )}
      </div>

      {/* Tag cloud */}
      {tags.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Popular tags</p>
          <TagCloud
            tags={tags}
            selectedTag={currentTag}
            onSelect={(tag) => updateParams({ tag_filter: tag })}
          />
        </div>
      )}
    </div>
  )
}
