"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkle } from "@phosphor-icons/react"

export default function SummarizerPage() {
  const [body, setBody] = useState("")
  const [classCode, setClassCode] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSummary("")

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, classCode: classCode || undefined }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setSummary(data.summary)
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">AI Note Summarizer</h1>
        <p className="text-muted-foreground">
          Paste your notes and get a structured summary with key concepts and study tips.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Course <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="e.g. CS225"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Notes content</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste your notes here..."
            rows={10}
            required
            className="resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1">{body.length.toLocaleString()} characters</p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full gap-2 bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] text-white hover:opacity-90"
        >
          <Sparkle size={16} weight="bold" />
          {loading ? "Summarizing..." : "Summarize notes"}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {summary && (
        <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)]">
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[var(--terracotta)] prose-strong:text-foreground prose-li:text-muted-foreground prose-p:text-muted-foreground">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
