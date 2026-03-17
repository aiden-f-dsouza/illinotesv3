import type { Metadata } from "next"

export const metadata: Metadata = { title: "Support" }

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-2">Support</h1>
      <p className="text-muted-foreground mb-10">Get help with IlliNotes.</p>

      <div className="space-y-6">
        {[
          {
            q: "How do I access the notes feed?",
            a: "You need to create an account and share at least one note. This keeps our community high-quality — everyone contributes.",
          },
          {
            q: "What file types can I upload?",
            a: "You can upload PDFs, images (PNG, JPG, GIF), Word documents (DOC, DOCX), PowerPoint files (PPT, PPTX), and plain text files (TXT). Maximum file size is 32 MB.",
          },
          {
            q: "How does the AI Tutor work?",
            a: "Click the sparkle button in the bottom-right corner to open the AI chat. Click 'Ask AI' on any note to give the AI context about that specific note. You have 30 AI chat messages per day.",
          },
          {
            q: "How do I @mention someone?",
            a: "In a comment, type @ followed by a username (e.g., @johndoe). The mentioned user will get a notification in their mentions bell.",
          },
          {
            q: "I forgot my password. What do I do?",
            a: "Click 'Forgot password?' on the login page. Enter your email and we'll send you a reset link.",
          },
          {
            q: "My verification email isn't arriving.",
            a: "Check your spam folder. If it's not there, try signing up again with the same email — this will resend the verification.",
          },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-sm)]">
            <h3 className="font-semibold mb-2">{item.q}</h3>
            <p className="text-muted-foreground text-sm">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-[var(--terracotta)]/10 border border-[var(--terracotta)]/20 rounded-xl p-5 text-center">
        <p className="text-sm text-muted-foreground">Still need help?</p>
        <p className="font-medium mt-1">
          Email us at{" "}
          <a href="mailto:support@illinotes.com" className="text-[var(--terracotta)] hover:underline">
            support@illinotes.com
          </a>
        </p>
      </div>
    </div>
  )
}
