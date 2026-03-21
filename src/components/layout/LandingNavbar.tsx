"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CaretDown, List, X } from "@phosphor-icons/react/dist/ssr"

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-[1000]">
      {/* Main bar */}
      <div className="px-6 md:px-8 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/landing" className="shrink-0">
          <span className="font-serif font-bold text-xl lowercase text-[var(--terracotta)] tracking-tight">
            illinotes
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/leaderboard">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground hover:bg-foreground/8">
              Leaderboard
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground hover:bg-foreground/8">
              Blog
            </Button>
          </Link>
          <Link href="/forum">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground hover:bg-foreground/8">
              Forum
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 px-3 h-8 rounded-md hover:bg-foreground/8 text-sm text-foreground/70 hover:text-foreground transition-colors">
              About
              <CaretDown size={12} weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/philosophy">Philosophy</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/team">Meet the Team</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2 text-foreground/70 hover:text-foreground transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--paper)]/95 backdrop-blur-sm border-b border-border/40 px-6 py-4 flex flex-col gap-1">
          <Link href="/leaderboard" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-foreground/70 hover:text-foreground">
              Leaderboard
            </Button>
          </Link>
          <Link href="/blog" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-foreground/70 hover:text-foreground">
              Blog
            </Button>
          </Link>
          <Link href="/forum" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-foreground/70 hover:text-foreground">
              Forum
            </Button>
          </Link>
          <Link href="/philosophy" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-foreground/70 hover:text-foreground">
              Philosophy
            </Button>
          </Link>
          <Link href="/team" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-foreground/70 hover:text-foreground">
              Meet the Team
            </Button>
          </Link>
          <div className="pt-2">
            <Link href="/notes" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white">
                Share Notes
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
