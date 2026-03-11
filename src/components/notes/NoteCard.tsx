"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Heart, PencilSimple, Trash, BookOpen } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsThree } from "@phosphor-icons/react"
import { AttachmentList } from "./AttachmentList"
import { CommentSection } from "@/components/comments/CommentSection"
import { toggleLikeAction, deleteNoteAction } from "@/lib/notes/actions"
import { timeAgo } from "@/lib/utils"
import { toast } from "sonner"
import type { NoteWithCounts } from "@/types"
import type { Comment } from "@/types"

interface Props {
  note: NoteWithCounts & { comments: Comment[] }
  currentUserId?: string
  isAdmin?: boolean
  isLiked?: boolean
  index?: number
  onEdit?: (note: NoteWithCounts) => void
  onAskAI?: (note: NoteWithCounts) => void
}

export function NoteCard({ note, currentUserId, isAdmin, isLiked: initialLiked, index = 0, onEdit, onAskAI }: Props) {
  const [liked, setLiked] = useState(initialLiked ?? false)
  const [likeCount, setLikeCount] = useState(note._count.likes)
  const [isPending, startTransition] = useTransition()

  const canModify = currentUserId && (note.user_id === currentUserId || isAdmin)

  function handleLike() {
    if (!currentUserId) {
      toast.error("Please sign in to like notes.")
      return
    }
    // Optimistic update
    setLiked(!liked)
    setLikeCount((c) => c + (liked ? -1 : 1))

    startTransition(async () => {
      const result = await toggleLikeAction(note.id)
      if ("error" in result) {
        // Revert
        setLiked(liked)
        setLikeCount((c) => c + (liked ? 1 : -1))
        toast.error(result.error)
      } else {
        setLiked(result.liked)
        setLikeCount(result.count)
      }
    })
  }

  function handleDelete() {
    if (!confirm("Delete this note? This cannot be undone.")) return
    startTransition(async () => {
      const result = await deleteNoteAction(note.id)
      if (result.error) toast.error(result.error)
    })
  }

  const tags = note.tags
    ? note.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: "easeOut" }}
      className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow note-card-accent group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-base leading-snug line-clamp-2 mb-1">
            {note.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span className="font-medium text-[var(--indigo-brand)]">{note.author}</span>
            <span>·</span>
            <span>{timeAgo(note.created)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge
            variant="secondary"
            className="text-xs font-mono bg-[var(--indigo-brand)]/10 text-[var(--indigo-brand)] border-[var(--indigo-brand)]/20"
          >
            {note.class_code}
          </Badge>

          {canModify && (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent">
                <DotsThree size={16} weight="bold" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(note)} className="gap-2">
                  <PencilSimple size={13} /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive">
                  <Trash size={13} /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line mb-3">
        {note.body}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] border border-[var(--terracotta)]/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Attachments */}
      <AttachmentList attachments={note.attachments} />

      {/* Footer: Like, Comments, Ask AI */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
        <motion.button
          whileTap={{ scale: 0.82 }}
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked
              ? "text-red-500"
              : "text-muted-foreground hover:text-red-400"
          }`}
        >
          <Heart
            size={15}
            weight={liked ? "fill" : "regular"}
          />
          <span>{likeCount}</span>
        </motion.button>

        <CommentSection
          noteId={note.id}
          comments={note.comments}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          isLoggedIn={!!currentUserId}
        />

        {onAskAI && (
          <button
            onClick={() => onAskAI(note)}
            className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[var(--terracotta)] transition-colors"
          >
            <BookOpen size={13} />
            Ask AI
          </button>
        )}
      </div>
    </motion.div>
  )
}
