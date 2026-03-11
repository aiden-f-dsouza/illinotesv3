"use client"

import { useState, useTransition } from "react"
import { editCommentAction, deleteCommentAction } from "@/lib/notes/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsThree, PencilSimple, Trash } from "@phosphor-icons/react"
import { timeAgo } from "@/lib/utils"
import { toast } from "sonner"
import type { Comment } from "@/types"

interface Props {
  comment: Comment
  currentUserId?: string
  isAdmin?: boolean
}

export function CommentItem({ comment, currentUserId, isAdmin }: Props) {
  const [editing, setEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [isPending, startTransition] = useTransition()

  const canEdit = currentUserId && (comment.user_id === currentUserId || isAdmin)

  function handleEdit() {
    if (!editBody.trim()) return
    const formData = new FormData()
    formData.set("commentId", String(comment.id))
    formData.set("body", editBody)

    startTransition(async () => {
      const result = await editCommentAction(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        setEditing(false)
      }
    })
  }

  function handleDelete() {
    if (!confirm("Delete this comment?")) return
    startTransition(async () => {
      const result = await deleteCommentAction(comment.id)
      if (result.error) toast.error(result.error)
    })
  }

  // Render @mentions with highlight
  function renderBody(text: string) {
    return text.split(/(@[a-zA-Z0-9_]{3,20})/g).map((part, i) =>
      part.startsWith("@") ? (
        <span key={i} className="text-[var(--terracotta)] font-medium">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  return (
    <div className="group py-2.5 border-b border-border last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 mb-0.5">
            <span className="text-sm font-semibold">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{timeAgo(comment.created)}</span>
          </div>

          {editing ? (
            <div className="space-y-2">
              <Textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={2}
                className="text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit} disabled={isPending}
                  className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white">
                  {isPending ? "Saving…" : "Save"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditBody(comment.body) }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground/90 break-words">{renderBody(comment.body)}</p>
          )}
        </div>

        {canEdit && !editing && (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center h-6 w-6 rounded opacity-0 group-hover:opacity-100 shrink-0 hover:bg-accent transition-opacity">
              <DotsThree size={14} weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditing(true)} className="gap-2">
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
  )
}
