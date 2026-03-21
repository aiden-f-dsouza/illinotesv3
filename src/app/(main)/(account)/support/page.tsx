import type { Metadata } from "next"

export const metadata: Metadata = { title: "Support & Help" }

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-2">Support &amp; Help</h1>
      <p className="text-muted-foreground mb-10">We&apos;re here to help.</p>

      <div className="space-y-6">
        {[
          {
            q: "How do I share notes?",
            a: "Simply navigate to the Notes Feed and click the \"Create Note\" button. Fill in the course code, title, and content, then click \"Post\" to share your notes with the community.",
          },
          {
            q: "Is Illinotes really free?",
            a: "Yes! Illinotes is completely free with no paywalls or premium tiers. We believe that knowledge should be accessible to everyone, and we're committed to keeping the platform free forever.",
          },
          {
            q: "How do I use the AI summarizer?",
            a: "Visit the AI Tutor page and paste your lecture notes into the text box. Click \"Summarize\" and our AI will generate a concise summary in seconds. It's perfect for reviewing lengthy notes before exams.",
          },
          {
            q: "Can I edit or delete my notes?",
            a: "Absolutely! You can edit or delete any notes you've posted. Just navigate to your profile page and select the note you want to modify. Click \"Edit\" to update the content or \"Delete\" to remove it permanently.",
          },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-sm)]">
            <h3 className="font-semibold mb-2">{item.q}</h3>
            <p className="text-muted-foreground text-sm">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-[var(--terracotta)]/10 border border-[var(--terracotta)]/20 rounded-xl p-6 text-center">
        <h2 className="font-serif text-xl font-bold mb-2">Still Have Questions?</h2>
        <p className="text-muted-foreground mb-4">
          Have a question we didn&apos;t answer? Email us at{" "}
          <a href="mailto:illinotes67@gmail.com" className="text-[var(--terracotta)] hover:underline font-semibold">
            illinotes67@gmail.com
          </a>
        </p>
        <a
          href="mailto:illinotes67@gmail.com"
          className="inline-block bg-[var(--terracotta)] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Send Us a Message
        </a>
      </div>
    </div>
  )
}
