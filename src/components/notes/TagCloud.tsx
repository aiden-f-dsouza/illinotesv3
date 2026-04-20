"use client"

import type { TagCount } from "@/types"

interface Props {
  tags: TagCount[]
  selectedTag: string
  onSelect: (tag: string) => void
}

export function TagCloud({ tags, selectedTag, onSelect }: Props) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(({ tag, count }) => {
        const isSelected = selectedTag === tag

        return (
          <button
            key={tag}
            onClick={() => onSelect(isSelected ? "All" : tag)}
            className={`px-2.5 py-0.5 rounded-full text-xs transition-all border ${
              isSelected
                ? "bg-[var(--terracotta)] text-white border-[var(--terracotta)]"
                : "bg-[var(--terracotta)]/10 text-[var(--terracotta)] border-[var(--terracotta)]/20 hover:bg-[var(--terracotta)]/20"
            }`}
          >
            #{tag} ({count})
          </button>
        )
      })}
    </div>
  )
}
