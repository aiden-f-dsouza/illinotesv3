import { NextRequest, NextResponse } from "next/server"
import { getUserWithProfile } from "@/lib/auth/server"
import { getChatResponse } from "@/lib/ai/chat"
import { chatLimiter, checkLimit } from "@/lib/ratelimit/limiter"
import { z } from "zod"

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(4000),
    })
  ).max(20),
  noteContext: z.object({
    title: z.string(),
    body: z.string(),
    classCode: z.string(),
    attachmentText: z.string().optional(),
  }).optional(),
})

export async function POST(request: NextRequest) {
  const user = await getUserWithProfile()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Rate limit: 30/day per user
  const { success, reset } = await checkLimit(chatLimiter, `chat:${user.id}`)
  if (!success) {
    const resetDate = reset ? new Date(reset).toLocaleTimeString() : "tomorrow"
    return NextResponse.json(
      { error: `Daily chat limit reached (30/day). Resets at ${resetDate}.` },
      { status: 429 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  try {
    const reply = await getChatResponse(parsed.data.messages, parsed.data.noteContext)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "AI service error. Please try again." }, { status: 500 })
  }
}
