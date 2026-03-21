import Link from "next/link"
import { getUserWithProfile } from "@/lib/auth/server"
import { ThemeToggle } from "./ThemeToggle"
import { MentionsBell } from "@/components/shared/MentionsBell"
import { logoutAction } from "@/lib/auth/actions"
import { prisma } from "@/lib/db/prisma"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, Trophy, Sparkle, SignOut, User } from "@phosphor-icons/react/dist/ssr"

export async function Navbar() {
  const user = await getUserWithProfile()

  let mentions: any[] = []
  if (user) {
    const raw = await prisma.mention.findMany({
      where: { mentioned_user_email: user.email },
      orderBy: { created: "desc" },
      take: 20,
    })
    mentions = raw.map((m: (typeof raw)[0]) => ({
      ...m,
      created: m.created.toISOString(),
    }))
  }

  const initials = user
    ? (user.displayName || user.username).slice(0, 2).toUpperCase()
    : "?"

  return (
    <header className="sticky top-0 z-[1000] bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-6 md:px-8 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/landing" className="flex items-center gap-2 shrink-0">
          <span className="font-serif font-bold text-lg text-[var(--terracotta)]">
            illinotes
          </span>
        </Link>

        {/* Nav Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/notes">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                <BookOpen size={15} weight="bold" />
                Notes
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                <Trophy size={15} weight="bold" />
                Leaderboard
              </Button>
            </Link>
            <Link href="/summarizer">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                <Sparkle size={15} weight="bold" />
                AI Tools
              </Button>
            </Link>
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1 ml-auto">
          <ThemeToggle />

          {user ? (
            <>
              <MentionsBell mentions={mentions} />

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-2 px-2 h-8 rounded-md hover:bg-accent text-sm font-medium transition-colors">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="text-xs bg-[var(--terracotta)] text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block max-w-[120px] truncate">
                      {user.displayName}
                    </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User size={14} />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-0">
                    <form action={logoutAction} className="w-full">
                      <button type="submit" className="flex items-center gap-2 w-full px-2 py-1.5 text-destructive">
                        <SignOut size={14} />
                        Sign out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
