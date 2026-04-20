import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { created: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      author: true,
      class_code: true,
      body: true,
      created: true,
      score: true,
      _count: { select: { comments: true } },
    },
  })

  return NextResponse.json(
    notes.map((n) => ({ ...n, created: n.created.toISOString() }))
  )
}
