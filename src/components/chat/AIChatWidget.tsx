"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkle, X, PaperPlaneTilt, Robot } from "@phosphor-icons/react"
import type { NoteWithCounts } from "@/types"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  isLoggedIn?: boolean
}

export function AIChatWidget({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeNote, setActiveNote] = useState<NoteWithCounts | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Expose method for NoteCard "Ask AI" buttons
  useEffect(() => {
    ;(window as any).__illinotes_askAI = (note: NoteWithCounts) => {
      setActiveNote(note)
      setOpen(true)
      setMessages([
        {
          role: "assistant",
          content: `I'm ready to help you understand **${note.title}** (${note.class_code}). What would you like to know?`,
        },
      ])
    }
    return () => {
      delete (window as any).__illinotes_askAI
    }
  }, [])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          noteContext: activeNote
            ? {
                title: activeNote.title,
                body: activeNote.body,
                classCode: activeNote.class_code,
              }
            : undefined,
        }),
      })

      const data = await res.json()
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ ${data.error}` },
        ])
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) return null

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[5000] w-13 h-13 bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] text-white rounded-full shadow-[var(--shadow-lg)] flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="Open AI Tutor"
          >
            <Sparkle size={22} weight="fill" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-[5000] w-[min(380px,calc(100vw-2rem))] flex flex-col bg-card border border-border rounded-2xl shadow-[var(--shadow-hover)] overflow-hidden"
            style={{ maxHeight: "min(520px, calc(100vh - 5rem))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[var(--terracotta)] to-[var(--ochre)] text-white">
              <div className="flex items-center gap-2">
                <Robot size={18} weight="bold" />
                <div>
                  <p className="text-sm font-semibold">AI Tutor</p>
                  {activeNote && (
                    <p className="text-xs opacity-80 truncate max-w-[200px]">
                      {activeNote.title}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {activeNote && (
                  <button
                    onClick={() => setActiveNote(null)}
                    className="text-xs opacity-70 hover:opacity-100 px-2 py-1 rounded"
                  >
                    Clear context
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="opacity-80 hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <Robot size={32} className="mx-auto mb-3 text-[var(--terracotta)] opacity-60" />
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about your UIUC coursework!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click &ldquo;Ask AI&rdquo; on a note to get context-aware help.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--terracotta)] text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content.split("\n").map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground">
                    <span className="animate-pulse">Thinking…</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                rows={1}
                className="resize-none flex-1 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="shrink-0 bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white self-end"
              >
                <PaperPlaneTilt size={15} weight="bold" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
