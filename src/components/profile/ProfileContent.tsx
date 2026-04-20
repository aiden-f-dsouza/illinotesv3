"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Notebook,
  ChatCircle,
  PencilSimple,
  Trash,
  DotsThree,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditNoteModal } from "@/components/notes/EditNoteModal"
import {
  deleteNoteAction,
  editCommentAction,
  deleteCommentAction,
} from "@/lib/notes/actions"
import { timeAgo } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { NoteWithCounts, Comment } from "@/types"

type Tab = "notes" | "comments"

interface ProfileComment extends Comment {
  note_title: string
}

interface Props {
  notes: NoteWithCounts[]
  comments: ProfileComment[]
  subjects: string[]
  coursesDict: Record<string, number[]>
}

export function ProfileContent({
  notes,
  comments,
  subjects,
  coursesDict,
}: Props) {
  const [tab, setTab] = useState<Tab>("notes")
  const [editingNote, setEditingNote] = useState<NoteWithCounts | null>(null)

  return (
    <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-sm)]">
      {/* Tab header */}
      <div className="flex border-b border-border">
        <TabButton
          active={tab === "notes"}
          onClick={() => setTab("notes")}
          icon={<Notebook size={15} />}
          label="My Notes"
          count={notes.length}
        />
        <TabButton
          active={tab === "comments"}
          onClick={() => setTab("comments")}
          icon={<ChatCircle size={15} />}
          label="My Comments"
          count={comments.length}
        />
      </div>

      {/* Tab content */}
      <div className="p-4 sm:p-5">
        <AnimatePresence mode="wait">
          {tab === "notes" ? (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {notes.length === 0 ? (
                <EmptyState
                  icon={<Notebook size={32} className="text-muted-foreground/40" />}
                  message="You haven't posted any notes yet."
                />
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <ProfileNoteCard
                      key={note.id}
                      note={note}
                      onEdit={() => setEditingNote(note)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="comments"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {comments.length === 0 ? (
                <EmptyState
                  icon={<ChatCircle size={32} className="text-muted-foreground/40" />}
                  message="You haven't posted any comments yet."
                />
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <ProfileCommentCard key={comment.id} comment={comment} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EditNoteModal
        note={editingNote}
        onClose={() => setEditingNote(null)}
        subjects={subjects}
        coursesDict={coursesDict}
      />
    </div>
  )
}

/* ── Tab button ─────────────────────────────────────────────────────────── */

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground/70"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full ${
          active
            ? "bg-[var(--terracotta)]/10 text-[var(--terracotta)]"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
      {active && (
        <motion.div
          layoutId="profile-tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--terracotta)]"
        />
      )}
    </button>
  )
}

/* ── Empty state ────────────────────────────────────────────────────────── */

function EmptyState({
  icon,
  message,
}: {
  icon: React.ReactNode
  message: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      {icon}
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

/* ── Note card (compact) ────────────────────────────────────────────────── */

function ProfileNoteCard({
  note,
  onEdit,
}: {
  note: NoteWithCounts
  onEdit: () => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Delete this note? This cannot be undone.")) return
    startTransition(async () => {
      const result = await deleteNoteAction(note.id)
      if (result.error) toast.error(result.error)
      else toast.success("Note deleted.")
    })
  }

  const tags = note.tags
    ? note.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  return (
    <div className="group border border-border rounded-lg p-4 hover:shadow-[var(--shadow-sm)] transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-bold text-sm leading-snug line-clamp-1 mb-1">
            {note.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Badge
              variant="secondary"
              className="text-[10px] font-mono bg-[var(--indigo-brand)]/10 text-[var(--indigo-brand)] border-[var(--indigo-brand)]/20"
            >
              {note.class_code}
            </Badge>
            <span>{timeAgo(note.created)}</span>
            <span>·</span>
            <span>{note.score} points</span>
            <span>·</span>
            <span>{note._count.comments} comments</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent shrink-0">
            <DotsThree size={16} weight="bold" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="gap-2">
              <PencilSimple size={13} /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isPending}
              className="gap-2 text-destructive"
            >
              <Trash size={13} /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mt-2 whitespace-pre-line">
        {note.body}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] border border-[var(--terracotta)]/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Comment card (compact) ─────────────────────────────────────────────── */

function ProfileCommentCard({ comment }: { comment: ProfileComment }) {
  const [editing, setEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [isPending, startTransition] = useTransition()

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
        toast.success("Comment updated.")
        setEditing(false)
      }
    })
  }

  function handleDelete() {
    if (!confirm("Delete this comment?")) return
    startTransition(async () => {
      const result = await deleteCommentAction(comment.id)
      if (result.error) toast.error(result.error)
      else toast.success("Comment deleted.")
    })
  }

  return (
    <div className="group border border-border rounded-lg p-4 hover:shadow-[var(--shadow-sm)] transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">
            On{" "}
            <span className="font-medium text-foreground">
              {comment.note_title}
            </span>{" "}
            · {timeAgo(comment.created)}
          </p>

          {editing ? (
            <div className="space-y-2 mt-2">
              <Textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={2}
                className="text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={isPending}
                  className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white"
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false)
                    setEditBody(comment.body)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground/90 break-words line-clamp-3">
              {comment.body}
            </p>
          )}
        </div>

        {!editing && (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent shrink-0">
              <DotsThree size={16} weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setEditing(true)}
                className="gap-2"
              >
                <PencilSimple size={13} /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isPending}
                className="gap-2 text-destructive"
              >
                <Trash size={13} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
