import { NextRequest, NextResponse } from "next/server"
import { getUserWithProfile } from "@/lib/auth/server"
import { summarizeNote } from "@/lib/ai/summarize"
import { z } from "zod"

const schema = z.object({
  body: z.string().min(10).max(50000),
  classCode: z.string().max(20).optional(),
})

export async function POST(request: NextRequest) {
  const user = await getUserWithProfile()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
    const summary = await summarizeNote(parsed.data.body, parsed.data.classCode)
    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Summarize error:", error)
    return NextResponse.json({ error: "AI service error. Please try again." }, { status: 500 })
  }
}
