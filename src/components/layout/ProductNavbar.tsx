"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CaretLeft, CaretDown, User, SignOut, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"
import { ThemeToggle } from "./ThemeToggle"
import { logoutAction } from "@/lib/auth/actions"

type NavUser = { displayName: string; username: string } | null

function NotesSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("search") || "")
  const [, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set("search", query.trim())
    } else {
      params.delete("search")
    }
    params.delete("page")
    startTransition(() => router.push(`/notes?${params.toString()}`))
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <MagnifyingGlass
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          className="h-9 pl-9 pr-3 w-full rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 focus:border-[var(--terracotta)] transition-colors"
        />
      </div>
    </form>
  )
}

export function ProductNavbar({ user }: { user: NavUser }) {
  const pathname = usePathname()
  const isNotesPage = pathname === "/notes"

  const initials = user
    ? (user.displayName || user.username).slice(0, 2).toUpperCase()
    : "?"

  return (
    <header className="sticky top-0 z-[1000] bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-6 md:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left side: logo + optional back link */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/landing">
            <span className="font-serif font-bold text-xl lowercase text-[var(--terracotta)] tracking-tight">
              illinotes
            </span>
          </Link>

          {!isNotesPage && (
            <Link
              href="/notes"
              className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <CaretLeft size={13} weight="bold" />
              Back to Notes Feed
            </Link>
          )}
        </div>

        {/* Center: search bar (notes page only) */}
        {isNotesPage && (
          <div className="flex-1 flex justify-center px-4">
            <Suspense fallback={null}>
              <NotesSearchBar />
            </Suspense>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1 shrink-0">
          <Link href="/leaderboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Leaderboard
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 px-3 h-8 rounded-md hover:bg-accent text-[0.8rem] text-muted-foreground hover:text-foreground font-medium transition-colors">
              Other Products
              <CaretDown size={12} weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/summarizer" className="w-full block">AI Summarizer</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/forum" className="w-full block">Forum</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {user ? (
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
