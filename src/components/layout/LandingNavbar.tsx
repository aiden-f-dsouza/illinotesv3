import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"

export function LandingNavbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] bg-transparent">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/landing" className="shrink-0">
          <span className="font-serif font-bold text-xl lowercase text-[var(--terracotta)] tracking-tight">
            illinotes
          </span>
        </Link>

        {/* Nav Links */}
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
              <DropdownMenuItem>
                <Link href="/philosophy" className="w-full">Philosophy</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/team" className="w-full">Meet the Team</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

      </div>
    </header>
  )
}
