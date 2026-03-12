import { CheckSquare, XSquare } from "@phosphor-icons/react/dist/ssr"

const features = [
  { label: "Organized Notes",   groupChat: false, groupMe: false, quizlet: true,  chegg: true,  illini: true },
  { label: "UIUC-Specific",     groupChat: false, groupMe: false, quizlet: false, chegg: false, illini: true },
  { label: "Searchable",        groupChat: false, groupMe: false, quizlet: true,  chegg: true,  illini: true },
  { label: "Community-Driven",  groupChat: true,  groupMe: true,  quizlet: false, chegg: false, illini: true },
  { label: "Free Forever",      groupChat: true,  groupMe: true,  quizlet: false, chegg: false, illini: true },
  { label: "AI-Powered",        groupChat: false, groupMe: false, quizlet: false, chegg: true,  illini: true },
]

function Check({ value, highlight }: { value: boolean; highlight?: boolean }) {
  if (value) {
    return (
      <CheckSquare
        size={20}
        weight="fill"
        className={highlight ? "text-white" : "text-[var(--sage)]"}
      />
    )
  }
  return (
    <XSquare
      size={20}
      weight="fill"
      className={highlight ? "text-white/40" : "text-muted-foreground/40"}
    />
  )
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground border-b border-border">
              Feature
            </th>
            {["GroupChat", "GroupMe", "Quizlet", "Chegg"].map((name) => (
              <th
                key={name}
                className="text-center py-3 px-4 font-semibold text-muted-foreground border-b border-border"
              >
                {name}
              </th>
            ))}
            <th className="text-center py-3 px-4 font-bold text-white bg-[var(--terracotta)] rounded-t-lg border-b border-[var(--terracotta)]">
              IlliNotes
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((row, i) => (
            <tr
              key={row.label}
              className={i % 2 === 0 ? "bg-[var(--paper-dark)]/40" : ""}
            >
              <td className="py-3 px-4 font-medium border-b border-border/50">{row.label}</td>
              <td className="py-3 px-4 text-center border-b border-border/50">
                <span className="flex justify-center"><Check value={row.groupChat} /></span>
              </td>
              <td className="py-3 px-4 text-center border-b border-border/50">
                <span className="flex justify-center"><Check value={row.groupMe} /></span>
              </td>
              <td className="py-3 px-4 text-center border-b border-border/50">
                <span className="flex justify-center"><Check value={row.quizlet} /></span>
              </td>
              <td className="py-3 px-4 text-center border-b border-border/50">
                <span className="flex justify-center"><Check value={row.chegg} /></span>
              </td>
              <td
                className={`py-3 px-4 text-center border-b border-[var(--terracotta)]/30 bg-[var(--terracotta)] ${
                  i === features.length - 1 ? "rounded-b-lg" : ""
                }`}
              >
                <span className="flex justify-center"><Check value={row.illini} highlight /></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
