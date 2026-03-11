import { Skeleton } from "@/components/ui/skeleton"

function NoteCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-sm)] note-card-accent">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-1.5" />
      <Skeleton className="h-4 w-5/6 mb-1.5" />
      <Skeleton className="h-4 w-4/6 mb-4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-16 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
    </div>
  )
}

export default function NotesLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
