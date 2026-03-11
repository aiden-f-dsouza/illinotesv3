import { NextRequest, NextResponse } from "next/server"
import { getUserWithProfile } from "@/lib/auth/server"
import { prisma } from "@/lib/db/prisma"

export async function POST() {
  const user = await getUserWithProfile()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.mention.updateMany({
    where: { mentioned_user_email: user.email, is_read: false },
    data: { is_read: true },
  })

  return NextResponse.json({ success: true })
}
