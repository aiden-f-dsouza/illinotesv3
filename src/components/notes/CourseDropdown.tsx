"use client"

import { useState, useRef, useEffect } from "react"
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react"

interface Props {
  subjects: string[]
  coursesDict: Record<string, number[]>
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  name?: string
}

export function CourseDropdown({
  subjects,
  coursesDict,
  value,
  onChange,
  placeholder = "Select course",
  id,
  name,
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Compute filtered results
  const searchLower = search.toLowerCase()
  const filtered: string[] = []

  if (searchLower) {
    for (const subj of subjects) {
      const nums = coursesDict[subj] || []
      for (const num of nums) {
        const full = `${subj}${num}`
        if (full.toLowerCase().includes(searchLower) || subj.toLowerCase().includes(searchLower)) {
          filtered.push(full)
        }
      }
    }
  } else if (selectedSubject) {
    const nums = coursesDict[selectedSubject] || []
    for (const num of nums) {
      filtered.push(`${selectedSubject}${num}`)
    }
  }

  function selectCourse(course: string) {
    onChange(course)
    setOpen(false)
    setSearch("")
  }

  return (
    <div ref={ref} className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-background border border-input rounded-lg text-sm hover:border-[var(--terracotta)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        <CaretDown
          size={14}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full min-w-[220px] bg-popover border border-border rounded-lg shadow-[var(--shadow-lg)] overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <MagnifyingGlass size={14} className="absolute left-2.5 top-2 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSelectedSubject("")
                }}
                placeholder="Search courses..."
                className="w-full pl-7 pr-3 py-1.5 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-[var(--terracotta)]"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {search ? (
              // Search results
              filtered.length > 0 ? (
                filtered.slice(0, 50).map((course) => (
                  <button
                    key={course}
                    type="button"
                    onClick={() => selectCourse(course)}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors ${
                      value === course ? "text-[var(--terracotta)] font-medium" : ""
                    }`}
                  >
                    {course}
                  </button>
                ))
              ) : (
                <p className="px-3 py-3 text-sm text-muted-foreground">No courses found</p>
              )
            ) : selectedSubject ? (
              // Course numbers for selected subject
              <>
                <button
                  type="button"
                  onClick={() => setSelectedSubject("")}
                  className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent border-b border-border"
                >
                  ← Back to subjects
                </button>
                {(coursesDict[selectedSubject] || []).map((num) => {
                  const course = `${selectedSubject}${num}`
                  return (
                    <button
                      key={course}
                      type="button"
                      onClick={() => selectCourse(course)}
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors ${
                        value === course ? "text-[var(--terracotta)] font-medium" : ""
                      }`}
                    >
                      {course}
                    </button>
                  )
                })}
              </>
            ) : (
              // Subject list
              subjects.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setSelectedSubject(subj)}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors flex items-center justify-between"
                >
                  <span>{subj}</span>
                  <span className="text-xs text-muted-foreground">
                    {(coursesDict[subj] || []).length}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
