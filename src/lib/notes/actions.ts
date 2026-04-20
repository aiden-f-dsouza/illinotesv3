"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db/prisma"
import { getUserWithProfile } from "@/lib/auth/server"
import { hasProfanity } from "@/lib/profanity/checker"
import { extractHashtags, extractMentions, isAllowedFile } from "@/lib/utils"
import { sendMentionNotification } from "@/lib/email/resend"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { ActionResult } from "@/lib/auth/actions"
import { v4 as uuidv4 } from "uuid"

const SUPABASE_STORAGE_BUCKET = "note-attachments"

// ─── CREATE NOTE ─────────────────────────────────────────────────────────────

export async function createNoteAction(formData: FormData): Promise<ActionResult> {
  const user = await getUserWithProfile()
  if (!user) return { error: "Not authenticated." }

  const title = formData.get("title")?.toString().trim()
  const body = formData.get("body")?.toString().trim()
  const classCode = formData.get("class")?.toString().trim()
  const rawTags = formData.get("tags")?.toString().trim() || ""
  const file = formData.get("file") as File | null

  if (!title || !body || !classCode) return { error: "Title, body, and class are required." }

  if (hasProfanity(title, body, rawTags)) {
    return { error: "Your note contains inappropriate language. Please revise it." }
  }

  const tags = extractHashtags(`#${rawTags.split(/[\s,]+/).filter(Boolean).join(" #")}`).join(", ")

  const note = await prisma.note.create({
    data: {
      author: user.displayName || user.username,
      title,
      body,
      class_code: classCode,
      user_id: user.id,
      tags: tags || null,
    },
  })

  // Handle file upload
  if (file && file.size > 0) {
    if (!isAllowedFile(file.name)) {
      return { error: "File type not allowed." }
    }
    if (file.size > 32 * 1024 * 1024) {
      return { error: "File too large (max 32 MB)." }
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin"
    const filename = `${uuidv4()}.${ext}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const supabase = await createClient()
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (!uploadError) {
      await prisma.attachment.create({
        data: {
          note_id: note.id,
          filename,
          original_filename: file.name,
          file_type: ext,
        },
      })
    }
  }

  revalidatePath("/notes")
  return { success: "Note posted!" }
}

// ─── EDIT NOTE ────────────────────────────────────────────────────────────────

export async function editNoteAction(formData: FormData): Promise<ActionResult> {
  const user = await getUserWithProfile()
  if (!user) return { error: "Not authenticated." }

  const noteId = parseInt(formData.get("noteId")?.toString() || "0")
  const title = formData.get("title")?.toString().trim()
  const body = formData.get("body")?.toString().trim()
  const classCode = formData.get("class")?.toString().trim()
  const rawTags = formData.get("tags")?.toString().trim() || ""

  if (!noteId || !title || !body || !classCode) return { error: "Missing required fields." }

  const note = await prisma.note.findUnique({ where: { id: noteId } })
  if (!note) return { error: "Note not found." }
  if (note.user_id !== user.id && !user.isAdmin) return { error: "Not authorized." }

  if (hasProfanity(title, body, rawTags)) {
    return { error: "Your note contains inappropriate language." }
  }

  const tags = extractHashtags(`#${rawTags.split(/[\s,]+/).filter(Boolean).join(" #")}`).join(", ")

  await prisma.note.update({
    where: { id: noteId },
    data: { title, body, class_code: classCode, tags: tags || null },
  })

  revalidatePath("/notes")
  return { success: "Note updated." }
}

// ─── DELETE NOTE ──────────────────────────────────────────────────────────────

export async function deleteNoteAction(noteId: number): Promise<ActionResult> {
  const user = await getUserWithProfile()
  if (!user) return { error: "Not authenticated." }

  const note = await prisma.note.findUnique({ where: { id: noteId } })
  if (!note) return { error: "Note not found." }
  if (note.user_id !== user.id && !user.isAdmin) return { error: "Not authorized." }

  // Delete attachment files from Supabase storage
  const attachments = await prisma.attachment.findMany({ where: { note_id: noteId } })
  if (attachments.length > 0) {
    const supabase = await createClient()
    await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove(attachments.map((a) => a.filename))
  }

  await prisma.like.deleteMany({ where: { note_id: noteId } })
  await prisma.mention.deleteMany({ where: { note_id: noteId } })
  await prisma.comment.deleteMany({ where: { note_id: noteId } })
  await prisma.attachment.deleteMany({ where: { note_id: noteId } })
  await prisma.note.delete({ where: { id: noteId } })

  revalidatePath("/notes")
  return { success: "Note deleted." }
}

// ─── LIKE TOGGLE ──────────────────────────────────────────────────────────────

export async function toggleLikeAction(
  noteId: number
): Promise<{ liked: boolean; count: number } | { error: string }> {
  const user = await getUserWithProfile()
  if (!user) return { error: "Not authenticated." }

  const existing = await prisma.like.findUnique({
    where: { note_id_user_id: { note_id: noteId, user_id: user.id } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
  } else {
    await prisma.like.create({ data: { note_id: noteId, user_id: user.id } })
  }

  const count = await prisma.like.count({ where: { note_id: noteId } })
  revalidatePath("/notes")
  return { liked: !existing, count }
}

// ─── ADD COMMENT ──────────────────────────────────────────────────────────────

export async function addCommentAction(formData: FormData): Promise<ActionResult> {
  const user = await getUserWithProfile()
  if (!user) return { error: "Not authenticated." }

  const noteId = parseInt(formData.get("noteId")?.toString() || "0")
  const body = formData.get("body")?.toString().trim()

  if (!noteId || !body) return { error: "Comment body is required." }

  if (hasProfanity(body)) return { error: "Comment contains inappropriate language." }

  const note = await prisma.note.findUnique({ where: { id: noteId } })
  if (!note) return { error: "Note not found." }

  const comment = await prisma.comment.create({
    data: {
      note_id: noteId,
      author: user.displayName || user.username,
      body,
      user_id: user.id,
    },
  })

  // Handle @mentions
  const mentionedUsernames = extractMentions(body)
  const supabase = await createClient()

  for (const username of mentionedUsernames) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, id")
        .eq("username", username.toLowerCase())
        .single()

      if (profile?.email) {
        await prisma.mention.create({
          data: {
            comment_id: comment.id,
            note_id: noteId,
            mentioned_user_email: profile.email,
            mentioned_user_id: profile.id,
            mentioning_author: user.displayName || user.username,
          },
        })

        // Send email notification
        try {
          await sendMentionNotification(
            profile.email,
            user.displayName || user.username,
            note.title,
            body
          )
        } catch {}
      }
    } catch {}
  }

  revalidatePath("/notes")
  return { success: "Comment added." }
}

// ─── EDIT COMMENT ─────────────────────────────────────────────────────────────

export async function editCommentAction(formData: FormData): Promise<ActionResult> {
  const user = await getUserWithProfile()
  if (!user) return { error: "Not authenticated." }

  const commentId = parseInt(formData.get("commentId")?.toString() || "0")
  const body = formData.get("body")?.toString().trim()

  if (!commentId || !body) return { error: "Missing fields." }

  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) return { error: "Comment not found." }
  if (comment.user_id !== user.id && !user.isAdmin) return { error: "Not authorized." }

  if (hasProfanity(body)) return { error: "Comment contains inappropriate language." }

  await prisma.comment.update({ where: { id: commentId }, data: { body } })
  revalidatePath("/notes")
  return { success: "Comment updated." }
}

// ─── DELETE COMMENT ───────────────────────────────────────────────────────────

export async function deleteCommentAction(commentId: number): Promise<ActionResult> {
  const user = await getUserWithProfile()
  if (!user) return { error: "Not authenticated." }

  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) return { error: "Comment not found." }
  if (comment.user_id !== user.id && !user.isAdmin) return { error: "Not authorized." }

  await prisma.comment.delete({ where: { id: commentId } })
  revalidatePath("/notes")
  return { success: "Comment deleted." }
}

// ─── MARK MENTIONS READ ───────────────────────────────────────────────────────

export async function markMentionReadAction(mentionId: number): Promise<void> {
  const user = await getUserWithProfile()
  if (!user) return

  await prisma.mention.updateMany({
    where: { id: mentionId, mentioned_user_email: user.email },
    data: { is_read: true },
  })
  revalidatePath("/notes")
}

export async function markAllMentionsReadAction(): Promise<void> {
  const user = await getUserWithProfile()
  if (!user) return

  await prisma.mention.updateMany({
    where: { mentioned_user_email: user.email, is_read: false },
    data: { is_read: true },
  })
  revalidatePath("/notes")
}
