"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CommentItem } from "./CommentItem"
import { CommentForm } from "./CommentForm"
import { ChatCircle } from "@phosphor-icons/react"
import type { Comment } from "@/types"

interface Props {
  noteId: number
  comments: Comment[]
  currentUserId?: string
  isAdmin?: boolean
  isLoggedIn?: boolean
}

export function CommentSection({ noteId, comments, currentUserId, isAdmin, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[var(--terracotta)] transition-colors"
      >
        <ChatCircle size={15} weight={open ? "fill" : "regular"} />
        <span>{comments.length} {comments.length === 1 ? "comment" : "comments"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border">
              {comments.length > 0 ? (
                <div>
                  {comments.map((c) => (
                    <CommentItem
                      key={c.id}
                      comment={c}
                      currentUserId={currentUserId}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-3">
                  No comments yet. Be the first!
                </p>
              )}

              {isLoggedIn && <CommentForm noteId={noteId} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
