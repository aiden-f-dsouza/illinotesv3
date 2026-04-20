import { redirect } from "next/navigation"
import { getUserWithProfile } from "@/lib/auth/server"
import { prisma } from "@/lib/db/prisma"
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm"
import { ProfileContent } from "@/components/profile/ProfileContent"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SUBJECTS, COURSES_DICT } from "@/lib/courses/loader"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Profile" }

export default async function ProfilePage() {
  const user = await getUserWithProfile()
  if (!user) redirect("/login")

  const [noteCount, likeCount, commentCount, userNotes, userComments] =
    await Promise.all([
      prisma.note.count({ where: { user_id: user.id } }),
      prisma.like.count({
        where: { note: { user_id: user.id } },
      }),
      prisma.comment.count({ where: { user_id: user.id } }),
      prisma.note.findMany({
        where: { user_id: user.id },
        orderBy: { created: "desc" },
        include: {
          attachments: true,
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.comment.findMany({
        where: { user_id: user.id },
        orderBy: { created: "desc" },
        include: {
          note: { select: { title: true } },
        },
      }),
    ])

  const initials = (user.displayName || user.username)
    .slice(0, 2)
    .toUpperCase()

  // Serialize dates and shape comments for the client
  const serializedNotes = userNotes.map((n) => ({
    ...n,
    created: n.created.toISOString(),
    attachments: n.attachments.map((a) => ({
      ...a,
      uploaded_at: a.uploaded_at.toISOString(),
    })),
  }))

  const serializedComments = userComments.map((c) => ({
    id: c.id,
    note_id: c.note_id,
    author: c.author,
    body: c.body,
    user_id: c.user_id,
    created: c.created.toISOString(),
    note_title: c.note.title,
  }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Profile</h1>

      {/* Avatar & info */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-xl bg-[var(--terracotta)] text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-serif text-xl font-bold">
              {user.displayName}
            </h2>
            <p className="text-muted-foreground">@{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          {user.isAdmin && (
            <Badge className="ml-auto bg-[var(--terracotta)] text-white">
              Admin
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold font-serif">{noteCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Notes shared
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold font-serif">{likeCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Likes received
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold font-serif">{commentCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Comments</p>
          </div>
        </div>
      </div>

      {/* Notes & Comments management */}
      <div className="mb-6">
        <ProfileContent
          notes={serializedNotes}
          comments={serializedComments}
          subjects={SUBJECTS}
          coursesDict={COURSES_DICT}
        />
      </div>

      {/* Change password */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)]">
        <h3 className="font-serif text-lg font-bold mb-4">Change password</h3>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
