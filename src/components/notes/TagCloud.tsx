"use client"

import type { TagCount } from "@/types"

interface Props {
  tags: TagCount[]
  selectedTag: string
  onSelect: (tag: string) => void
}

export function TagCloud({ tags, selectedTag, onSelect }: Props) {
  if (tags.length === 0) return null

  const maxCount = Math.max(...tags.map((t) => t.count))

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(({ tag, count }) => {
        const isSelected = selectedTag === tag
        const size = count / maxCount // 0–1 for scaling
        const fontSize = 11 + Math.round(size * 5) // 11–16px

        return (
          <button
            key={tag}
            onClick={() => onSelect(isSelected ? "All" : tag)}
            style={{ fontSize }}
            className={`px-2 py-0.5 rounded-full transition-all border text-xs ${
              isSelected
                ? "bg-[var(--terracotta)] text-white border-[var(--terracotta)]"
                : "bg-[var(--terracotta)]/10 text-[var(--terracotta)] border-[var(--terracotta)]/20 hover:bg-[var(--terracotta)]/20"
            }`}
          >
            #{tag}
          </button>
        )
      })}
    </div>
  )
}
