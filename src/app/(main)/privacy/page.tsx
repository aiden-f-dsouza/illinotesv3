import type { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10">Last updated: January 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-serif space-y-6">
        <section>
          <h2>What we collect</h2>
          <p>We collect your email address, username, and the notes and comments you post. We store files you upload in Supabase Storage.</p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>Your information is used solely to provide the IlliNotes service: showing your notes to other users, sending notifications for @mentions, and enabling AI-powered features.</p>
        </section>
        <section>
          <h2>Data sharing</h2>
          <p>We do not sell your data. Notes you post are visible to all logged-in IlliNotes users. We use Supabase (database/auth/storage), OpenAI (AI features), and Resend (email).</p>
        </section>
        <section>
          <h2>Your rights</h2>
          <p>You can delete your notes at any time. To delete your account entirely, email us at support@illinotes.com.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>Questions? Email <a href="mailto:support@illinotes.com" className="text-[var(--terracotta)]">support@illinotes.com</a></p>
        </section>
      </div>
    </div>
  )
}
