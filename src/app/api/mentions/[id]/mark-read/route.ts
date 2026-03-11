import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db/prisma"
import { getUserWithProfile } from "@/lib/auth/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserWithProfile()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.mention.updateMany({
    where: { id: parseInt(id), mentioned_user_email: user.email },
    data: { is_read: true },
  })

  return NextResponse.json({ success: true })
}
