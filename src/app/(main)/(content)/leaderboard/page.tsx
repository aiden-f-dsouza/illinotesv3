import { prisma } from "@/lib/db/prisma"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, ArrowFatUp, NotePencil, ChatCircle, Star } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Leaderboard" }
export const revalidate = 300 // revalidate every 5 minutes

interface LeaderEntry {
  userId: string
  author: string
  total: number
  username?: string
  displayName?: string
}

async function getLeaderboards() {
  // Highest rated note authors (by total vote score)
  const topRatedRaw = await prisma.$queryRaw<{ user_id: string; author: string; total: bigint }[]>`
    SELECT user_id, author, SUM(score) as total
    FROM "note"
    GROUP BY user_id, author
    ORDER BY total DESC
    LIMIT 5
  `

  // Top note posters
  const topPostersRaw = await prisma.$queryRaw<{ user_id: string; author: string; total: bigint }[]>`
    SELECT user_id, author, COUNT(id) as total
    FROM "note"
    GROUP BY user_id, author
    ORDER BY total DESC
    LIMIT 5
  `

  // Top commenters
  const topCommentersRaw = await prisma.$queryRaw<{ user_id: string; author: string; total: bigint }[]>`
    SELECT user_id, author, COUNT(id) as total
    FROM "comment"
    WHERE user_id IS NOT NULL
    GROUP BY user_id, author
    ORDER BY total DESC
    LIMIT 5
  `

  // Most commented-on note authors
  const topCommentedOnRaw = await prisma.$queryRaw<{ user_id: string; author: string; total: bigint }[]>`
    SELECT n.user_id, n.author, COUNT(c.id) as total
    FROM "note" n
    JOIN "comment" c ON c.note_id = n.id
    GROUP BY n.user_id, n.author
    ORDER BY total DESC
    LIMIT 5
  `

  // Collect all unique user IDs to fetch profiles
  const allUserIds = [
    ...new Set([
      ...topRatedRaw,
      ...topPostersRaw,
      ...topCommentersRaw,
      ...topCommentedOnRaw,
    ].map((r) => r.user_id)),
  ]

  // Fetch profiles from Supabase
  const supabase = await createClient()
  const profilesMap: Record<string, { username: string; displayName: string }> = {}
  if (allUserIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .in("id", allUserIds)
    for (const p of data || []) {
      profilesMap[p.id] = {
        username: p.username || "",
        displayName: p.display_name || "",
      }
    }
  }

  function enrich(raw: { user_id: string; author: string; total: bigint }[]): LeaderEntry[] {
    return raw.map((r) => ({
      userId: r.user_id,
      author: r.author,
      total: Number(r.total),
      username: profilesMap[r.user_id]?.username || r.author,
      displayName: profilesMap[r.user_id]?.displayName || "",
    }))
  }

  return {
    topRated: enrich(topRatedRaw),
    topPosters: enrich(topPostersRaw),
    topCommenters: enrich(topCommentersRaw),
    topCommentedOn: enrich(topCommentedOnRaw),
  }
}

function MedalEmoji({ rank }: { rank: number }) {
  if (rank === 0) return <span>🥇</span>
  if (rank === 1) return <span>🥈</span>
  if (rank === 2) return <span>🥉</span>
  return <span className="text-sm font-mono text-muted-foreground w-6 text-center">{rank + 1}</span>
}

function LeaderboardCard({
  title,
  icon,
  entries,
  unit,
}: {
  title: string
  icon: React.ReactNode
  entries: LeaderEntry[]
  unit: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-sm)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-[var(--paper-dark)]">
        <span className="text-[var(--terracotta)]">{icon}</span>
        <h2 className="font-semibold text-sm">{title}</h2>
      </div>
      <div className="divide-y divide-border">
        {entries.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">No data yet</p>
        )}
        {entries.map((entry, i) => {
          const initials = (entry.displayName || entry.username || entry.author)
            .slice(0, 2)
            .toUpperCase()
          return (
            <div key={entry.userId + i} className="flex items-center gap-3 px-4 py-3">
              <MedalEmoji rank={i} />
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="text-xs bg-[var(--terracotta)]/20 text-[var(--terracotta)] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {entry.displayName || entry.username || entry.author}
                </p>
                {entry.username && (
                  <p className="text-xs text-muted-foreground">@{entry.username}</p>
                )}
              </div>
              <span className="text-sm font-bold text-[var(--terracotta)] tabular-nums">
                {entry.total.toLocaleString()}
                <span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default async function LeaderboardPage() {
  const { topRated, topPosters, topCommenters, topCommentedOn } = await getLeaderboards()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-[var(--terracotta)] mb-3">
          <Trophy size={28} weight="fill" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          Top contributors keeping the UIUC study community thriving.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LeaderboardCard
          title="Highest Rated"
          icon={<ArrowFatUp size={16} weight="fill" />}
          entries={topRated}
          unit="points"
        />
        <LeaderboardCard
          title="Top Note Sharers"
          icon={<NotePencil size={16} weight="bold" />}
          entries={topPosters}
          unit="notes"
        />
        <LeaderboardCard
          title="Most Active Commenters"
          icon={<ChatCircle size={16} weight="bold" />}
          entries={topCommenters}
          unit="comments"
        />
        <LeaderboardCard
          title="Most Discussed Notes"
          icon={<Star size={16} weight="fill" />}
          entries={topCommentedOn}
          unit="comments received"
        />
      </div>
    </div>
  )
}
