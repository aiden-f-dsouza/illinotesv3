import type { Metadata } from "next"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const metadata: Metadata = { title: "Team" }

const team = [
  { name: "IlliNotes Team", role: "Founders", initials: "IN" },
]

export default function TeamPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-2">Team</h1>
      <p className="text-muted-foreground mb-10">The students behind IlliNotes.</p>

      <div className="grid gap-4">
        {team.map((member) => (
          <div key={member.name} className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-sm)]">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="text-lg bg-[var(--terracotta)] text-white font-semibold">
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-muted-foreground text-sm text-center">
        Built with ❤️ at the University of Illinois Urbana-Champaign.
      </p>
    </div>
  )
}
