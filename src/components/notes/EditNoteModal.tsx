"use client"

import { useState, useTransition, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CourseDropdown } from "./CourseDropdown"
import { editNoteAction } from "@/lib/notes/actions"
import { toast } from "sonner"
import type { NoteWithCounts } from "@/types"

interface Props {
  note: NoteWithCounts | null
  onClose: () => void
  subjects: string[]
  coursesDict: Record<string, number[]>
}

export function EditNoteModal({ note, onClose, subjects, coursesDict }: Props) {
  const [selectedCourse, setSelectedCourse] = useState(note?.class_code || "")
  const [isPending, startTransition] = useTransition()

  // Sync course when note changes
  if (note && selectedCourse !== note.class_code && !isPending) {
    setSelectedCourse(note.class_code)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!note) return
    const formData = new FormData(e.currentTarget)
    formData.set("noteId", String(note.id))
    formData.set("class", selectedCourse)

    startTransition(async () => {
      const result = await editNoteAction(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Note updated.")
        onClose()
      }
    })
  }

  if (!note) return null

  const currentTags = note.tags
    ? note.tags.split(",").map((t) => t.trim()).join(", ")
    : ""

  return (
    <Dialog open={!!note} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Edit note</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <Input name="title" defaultValue={note.title} required maxLength={200} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Course</label>
            <CourseDropdown
              subjects={subjects}
              coursesDict={coursesDict}
              value={selectedCourse}
              onChange={setSelectedCourse}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Notes</label>
            <Textarea
              name="body"
              defaultValue={note.body}
              rows={6}
              required
              className="resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Tags <span className="text-muted-foreground font-normal">(comma-separated)</span>
            </label>
            <Input name="tags" defaultValue={currentTags} placeholder="midterm, chapter5" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white"
            >
              {isPending ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
