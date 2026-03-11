"use client"

import { useTransition, useRef } from "react"
import { addCommentAction } from "@/lib/notes/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Props {
  noteId: number
}

export function CommentForm({ noteId }: Props) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("noteId", String(noteId))

    startTransition(async () => {
      const result = await addCommentAction(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        formRef.current?.reset()
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <Textarea
        name="body"
        placeholder="Add a comment... Use @username to mention someone"
        rows={1}
        required
        className="resize-none text-sm flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
      />
      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white shrink-0 self-end"
      >
        {isPending ? "…" : "Post"}
      </Button>
    </form>
  )
}
