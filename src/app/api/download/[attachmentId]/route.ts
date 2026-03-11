import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db/prisma"

const BUCKET = "note-attachments"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> }
) {
  const { attachmentId } = await params
  const supabase = await createClient()

  const attachment = await prisma.attachment.findUnique({
    where: { id: parseInt(attachmentId) },
  })
  if (!attachment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Get a signed URL (60 second expiry)
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(attachment.filename, 60, {
      download: attachment.original_filename,
    })

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Failed to generate download link" }, { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}
