"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkle } from "@phosphor-icons/react"
import type { Metadata } from "next"

export default function SummarizerPage() {
  const [title, setTitle] = useState("")
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
        body: JSON.stringify({ title, body, classCode }),
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">Note title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lecture 7 – Sorting Algorithms"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Course</label>
            <Input
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="e.g. CS225"
              required
            />
          </div>
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
          {loading ? "Summarizing…" : "Summarize notes"}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {summary && (
        <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)]">
          <h2 className="font-serif text-xl font-bold mb-4 text-[var(--terracotta)]">Summary</h2>
          <div className="prose prose-sm max-w-none">
            {summary.split("\n").map((line, i) => {
              if (line.startsWith("**") && line.endsWith("**")) {
                return <h3 key={i} className="font-semibold mt-4 mb-1 text-foreground">{line.slice(2, -2)}</h3>
              }
              if (line.startsWith("- ") || line.startsWith("• ")) {
                return <li key={i} className="ml-4 text-muted-foreground">{line.slice(2)}</li>
              }
              if (line.trim() === "") return <br key={i} />
              return <p key={i} className="text-muted-foreground">{line}</p>
            })}
          </div>
        </div>
      )}
    </div>
  )
}
