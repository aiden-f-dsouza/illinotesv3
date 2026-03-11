import type { Metadata } from "next"

export const metadata: Metadata = { title: "Terms of Service" }

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-10">Last updated: January 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-serif space-y-6">
        <section>
          <h2>1. Use of service</h2>
          <p>IlliNotes is intended for University of Illinois students. By creating an account, you agree to use the service in good faith and in compliance with UIUC&apos;s academic integrity policies.</p>
        </section>
        <section>
          <h2>2. Your content</h2>
          <p>You own the notes you post. By posting, you grant IlliNotes a license to display them to other users. Do not post copyrighted material without permission, personal information of others, or content that violates university policy.</p>
        </section>
        <section>
          <h2>3. Prohibited conduct</h2>
          <p>Do not post profanity, harassment, or inappropriate content. Do not attempt to circumvent the feed gate or reverse-engineer the platform.</p>
        </section>
        <section>
          <h2>4. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </section>
        <section>
          <h2>5. Disclaimer</h2>
          <p>IlliNotes is provided &quot;as is.&quot; We are not responsible for the accuracy of user-posted notes.</p>
        </section>
        <section>
          <h2>6. Contact</h2>
          <p>Questions? Email <a href="mailto:support@illinotes.com" className="text-[var(--terracotta)]">support@illinotes.com</a></p>
        </section>
      </div>
    </div>
  )
}
