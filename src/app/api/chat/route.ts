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

  let rateLimitOk = true
  try {
    const { success, reset } = await checkLimit(chatLimiter, `chat:${user.id}`)
    if (!success) {
      const resetDate = reset ? new Date(reset).toLocaleTimeString() : "tomorrow"
      return NextResponse.json(
        { error: `Daily chat limit reached (30/day). Resets at ${resetDate}.` },
        { status: 429 }
      )
    }
  } catch (e: any) {
    console.error("Rate limit error:", e?.message)
    // Continue without rate limiting rather than blocking the user
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: `Invalid request: ${parsed.error.issues.map(i => i.message).join(", ")}` }, { status: 400 })
  }

  try {
    const reply = await getChatResponse(parsed.data.messages, parsed.data.noteContext)
    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("Chat error:", error)
    const msg = error?.status === 401
      ? "OpenAI API key is invalid."
      : error?.status === 429
        ? "OpenAI rate limit hit. Try again in a moment."
        : error?.code === "insufficient_quota"
          ? "OpenAI quota exceeded."
          : `AI service error: ${error?.message || "Unknown error"}`
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
