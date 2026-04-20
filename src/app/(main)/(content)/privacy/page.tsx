import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10">Last Updated: February 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-serif space-y-6">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Illinotes (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is a student note-sharing platform designed for university students.
            This Privacy Policy explains how we collect, use, and protect your information when you use our website
            at illinotes.com. By using Illinotes, you agree to the practices described in this policy.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li><strong>Account information:</strong> Your email address, collected when you sign up via Supabase Auth.</li>
            <li><strong>User content:</strong> Notes, comments, file attachments, and any other content you post on the platform.</li>
            <li><strong>Usage data:</strong> Likes, mentions, and interactions with other users&apos; content.</li>
            <li><strong>Session data:</strong> An authentication cookie (<code>access_token</code>) used to keep you logged in.</li>
          </ul>
          <p>We do not collect payment information, phone numbers, or any government-issued identification.</p>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and operate the Illinotes platform.</li>
            <li>Send transactional emails (e.g., password reset links) via our email provider, Resend.</li>
            <li>Notify you of @mentions in comments.</li>
            <li>Enforce our Terms of Service and community guidelines.</li>
            <li>Improve platform performance and fix bugs.</li>
          </ul>
          <p>We do not sell, rent, or share your personal information with advertisers or third-party marketers.</p>
        </section>

        <section>
          <h2>4. Data Storage &amp; Security</h2>
          <p>
            Your data is stored securely in a PostgreSQL database hosted by Supabase, with Row Level Security (RLS)
            policies enforced on all tables. File attachments are stored in Supabase Storage. We apply industry-standard
            security practices to protect your data from unauthorized access, but no method of electronic storage is
            100% secure.
          </p>
          <p>We never sell your data to advertisers or data brokers.</p>
        </section>

        <section>
          <h2>5. AI Features</h2>
          <p>
            Illinotes offers AI-powered features including the AI Tutor chat widget and the Note Summarizer. When you
            use these features, the content of your notes (including extracted PDF text and images) may be sent to
            OpenAI&apos;s API to generate responses. This data is processed in accordance with{" "}
            <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener" className="text-[var(--terracotta)]">
              OpenAI&apos;s Privacy Policy
            </a>.
            We recommend avoiding the submission of sensitive personal information through AI features.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>You have the following rights regarding your data:</p>
          <ul>
            <li><strong>Access and edit:</strong> You can edit or delete any notes and comments you have posted at any time.</li>
            <li>
              <strong>Account deletion:</strong> To delete your account and associated data, email us at{" "}
              <a href="mailto:illinotes67@gmail.com" className="text-[var(--terracotta)]">illinotes67@gmail.com</a>{" "}
              and we will process your request promptly.
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>
            We use a single session cookie (<code>access_token</code>) to authenticate you and keep you logged in.
            This cookie is HTTP-only and session-scoped. We do not use third-party tracking cookies, advertising
            cookies, or analytics cookies.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at{" "}
            <a href="mailto:illinotes67@gmail.com" className="text-[var(--terracotta)]">illinotes67@gmail.com</a>.
          </p>
        </section>

        <hr className="border-border" />
        <p>
          <Link href="/terms" className="text-[var(--terracotta)] hover:underline">
            View our Terms of Service →
          </Link>
        </p>
      </div>
    </div>
  )
}
