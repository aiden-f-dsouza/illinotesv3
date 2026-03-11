"use client"

import { Bell } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Mention } from "@/types"
import { timeAgo } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

interface Props {
  mentions: Mention[]
}

export function MentionsBell({ mentions }: Props) {
  const unread = mentions.filter((m) => !m.is_read)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function markRead(mentionId: number) {
    await fetch(`/api/mentions/${mentionId}/mark-read`, { method: "POST" })
    startTransition(() => router.refresh())
  }

  async function markAllRead() {
    await fetch("/api/mentions/mark-all-read", { method: "POST" })
    startTransition(() => router.refresh())
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Bell size={18} weight={unread.length > 0 ? "fill" : "regular"} />
          {unread.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[var(--terracotta)] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
              {unread.length > 9 ? "9+" : unread.length}
            </span>
          )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Mentions</span>
          {unread.length > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-[var(--terracotta)] hover:underline font-normal"
            >
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mentions.length === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground text-center">
            No mentions yet
          </div>
        ) : (
          mentions.slice(0, 10).map((mention) => (
            <DropdownMenuItem
              key={mention.id}
              className={`flex flex-col items-start gap-0.5 py-2.5 cursor-pointer ${
                !mention.is_read ? "bg-accent/50" : ""
              }`}
              onClick={() => !mention.is_read && markRead(mention.id)}
            >
              <span className="text-sm font-medium">
                @{mention.mentioning_author} mentioned you
              </span>
              <span className="text-xs text-muted-foreground line-clamp-2">
                {mention.is_read ? null : <span className="text-[var(--terracotta)] font-medium mr-1">●</span>}
                {timeAgo(mention.created)}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
