import type { Metadata } from "next"

export const metadata: Metadata = { title: "Our Philosophy" }

export default function PhilosophyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl font-bold mb-2">Our Philosophy</h1>
      <p className="text-muted-foreground mb-10">Why we built IlliNotes, and how we think about learning.</p>

      <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-serif">
        <h2>Knowledge flows when shared</h2>
        <p>
          The best universities in the world run on the free exchange of ideas. Yet most students
          sit in lectures, take private notes, and study alone — hoarding knowledge as if sharing
          diminishes it. We built IlliNotes on the opposite belief: sharing your notes makes
          everyone smarter, including you.
        </p>

        <h2>Give to get</h2>
        <p>
          We ask every student to post at least one note before accessing the feed. This isn&apos;t
          a paywall — it&apos;s a culture statement. Communities thrive when everyone contributes.
          A feed full of takers produces nothing worth taking.
        </p>

        <h2>Tools should serve students</h2>
        <p>
          AI is most useful when it amplifies your understanding, not when it does your thinking.
          Our AI tutor answers your questions about your own notes — it&apos;s a study companion,
          not a homework machine.
        </p>

        <h2>Built for Illinois</h2>
        <p>
          IlliNotes is specifically designed for UIUC students. We know the courses, the culture,
          and the pressure. This isn&apos;t a generic SaaS product — it&apos;s something we built
          because we wanted it to exist.
        </p>
      </div>
    </div>
  )
}
