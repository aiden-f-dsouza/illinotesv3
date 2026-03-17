import { redirect } from "next/navigation"
import { getUserWithProfile } from "@/lib/auth/server"
import { prisma } from "@/lib/db/prisma"
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Profile" }

export default async function ProfilePage() {
  const user = await getUserWithProfile()
  if (!user) redirect("/login")

  const [noteCount, likeCount, commentCount] = await Promise.all([
    prisma.note.count({ where: { user_id: user.id } }),
    prisma.like.count({
      where: {
        note: { user_id: user.id },
      },
    }),
    prisma.comment.count({ where: { user_id: user.id } }),
  ])

  const initials = (user.displayName || user.username).slice(0, 2).toUpperCase()

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
            <h2 className="font-serif text-xl font-bold">{user.displayName}</h2>
            <p className="text-muted-foreground">@{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          {user.isAdmin && (
            <Badge className="ml-auto bg-[var(--terracotta)] text-white">Admin</Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold font-serif">{noteCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Notes shared</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-serif">{likeCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Likes received</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-serif">{commentCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Comments</p>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)]">
        <h3 className="font-serif text-lg font-bold mb-4">Change password</h3>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
