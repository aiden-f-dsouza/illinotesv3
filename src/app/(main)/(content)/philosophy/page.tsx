import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Our Philosophy" }

export default function PhilosophyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl font-bold mb-2">Our Philosophy</h1>
      <p className="text-muted-foreground mb-10">Why we built Illinotes and what we believe in</p>

      <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-serif">
        <p>
          At Illinotes, we believe that knowledge should be accessible to everyone. Too often, students struggle to find quality notes and resources, buried in endless GroupMe threads or scattered across different platforms. We built Illinotes to solve this problem—a centralized hub where UIUC students can share, search, and collaborate on class notes.
        </p>

        <p>
          Our mission is simple: empower students to learn from each other. We&apos;re students ourselves, and we understand the challenges of navigating university coursework. That&apos;s why we created a platform that&apos;s completely free, easy to use, and built specifically for how UIUC courses work.
        </p>

        <p>
          We&apos;re committed to keeping Illinotes free forever. No paywalls, no premium tiers—just a platform designed to help students succeed. We believe that education is a collaborative effort, and our community-driven approach ensures that every student has access to the resources they need.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/notes"
          className="inline-block bg-[var(--terracotta)] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Explore the Notes Feed
        </Link>
      </div>
    </div>
  )
}
