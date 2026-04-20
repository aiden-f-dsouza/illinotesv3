"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createNoteAction } from "@/lib/notes/actions"
import { Paperclip, X, ShieldCheck } from "@phosphor-icons/react"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
  subjects: string[]
  coursesDict: Record<string, number[]>
  onSuccess?: () => void
}

export function CreateNoteModal({ open, onClose, subjects, coursesDict, onSuccess }: Props) {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedNumber, setSelectedNumber] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set("class", selectedSubject + selectedNumber)
    if (selectedFile) formData.set("file", selectedFile)

    startTransition(async () => {
      const result = await createNoteAction(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Note posted!")
        formRef.current?.reset()
        setSelectedSubject("")
        setSelectedNumber("")
        setSelectedFile(null)
        onClose()
        onSuccess?.()
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Share a note</DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <Input name="title" placeholder="What's this note about?" required maxLength={200} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Course</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value)
                  setSelectedNumber("")
                }}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm hover:border-[var(--terracotta)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 text-foreground"
              >
                <option value="" disabled>Subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={selectedNumber}
                onChange={(e) => setSelectedNumber(e.target.value)}
                disabled={!selectedSubject}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm hover:border-[var(--terracotta)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
              >
                <option value="" disabled>Number</option>
                {(coursesDict[selectedSubject] || []).map((n) => (
                  <option key={n} value={String(n)}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Notes</label>
            <Textarea
              name="body"
              placeholder="Share your notes, key concepts, study tips, exam insights..."
              rows={6}
              required
              className="resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Tags <span className="text-muted-foreground font-normal">(optional, comma-separated)</span>
            </label>
            <Input name="tags" placeholder="midterm, chapter5, formulas" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Attachment <span className="text-muted-foreground font-normal">(optional, max 32 MB)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.txt,.ppt,.pptx"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            {selectedFile ? (
              <div className="flex items-center gap-2 p-2.5 bg-accent/50 border border-border rounded-lg">
                <Paperclip size={14} className="text-[var(--terracotta)] shrink-0" />
                <span className="text-sm truncate flex-1">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Paperclip size={14} />
                Attach file
              </Button>
            )}
          </div>

          <div className="flex gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--terracotta)]" />
            <span>
              Share study notes and educational resources only. Do not upload exam answers, solutions to graded assignments, or any material that violates your institution&apos;s academic integrity policy.
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending || !selectedSubject || !selectedNumber}
              className="flex-1 bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] text-white hover:opacity-90"
            >
              {isPending ? "Posting…" : "Post note"}
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
