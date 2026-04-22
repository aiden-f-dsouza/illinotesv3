import OpenAI from "openai"
import type { NoteWithCounts } from "@/types"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT_BASE = `You are an AI tutor for UIUC students using Illinotes. You help students understand their class notes, explain concepts, and answer questions.

Personality:
- Warm, encouraging, and direct — like a sharp upperclassman who genuinely loves helping
- Use clear explanations with examples when helpful
- Keep responses concise but thorough
- If you don't know something, say so honestly

You have access to the student's note context below. Use it to give relevant, specific answers.`

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function getChatResponse(
  messages: ChatMessage[],
  noteContext?: {
    title: string
    body: string
    classCode: string
    attachmentText?: string
  }
): Promise<string> {
  const systemPrompt = noteContext
    ? `${SYSTEM_PROMPT_BASE}

--- NOTE CONTEXT ---
Course: ${noteContext.classCode}
Title: ${noteContext.title}
Content: ${noteContext.body.slice(0, 8000)}
${noteContext.attachmentText ? `\nAttachment text:\n${noteContext.attachmentText.slice(0, 6000)}` : ""}
--- END CONTEXT ---`
    : SYSTEM_PROMPT_BASE

  // Cap each message at 2k chars, keep last 10
  const cappedMessages = messages.slice(-10).map((m) => ({
    role: m.role,
    content: m.content.slice(0, 2000),
  }))

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }, ...cappedMessages],
    max_tokens: 800,
    temperature: 0.7,
  })

  return response.choices[0]?.message?.content || "I couldn't generate a response. Please try again."
}
