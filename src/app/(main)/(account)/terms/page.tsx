import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Terms of Service" }

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-10">Last Updated: February 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-serif space-y-6">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Illinotes (&ldquo;the platform,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use the platform. We reserve the right
            to update these terms at any time; continued use of the platform constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2>2. Eligibility</h2>
          <p>
            Illinotes is designed for university students, with a focus on the University of Illinois Urbana-Champaign
            community. Use of the platform is open to any university student. By creating an account, you represent
            that you are at least 13 years of age and are using the platform for educational purposes.
          </p>
        </section>

        <section>
          <h2>3. Permitted Use</h2>
          <p>You may use Illinotes to:</p>
          <ul>
            <li>Share personal study notes and lecture summaries you have created.</li>
            <li>Upload educational resources such as practice problems you authored or materials you have the right to share.</li>
            <li>Engage respectfully with other students through comments and likes.</li>
            <li>Use the AI Tutor and Summarizer tools to assist your studying.</li>
          </ul>
        </section>

        <section>
          <h2>4. Prohibited Content</h2>
          <p>You may not use Illinotes to post or share:</p>
          <ul>
            <li><strong>Academic integrity violations:</strong> Exam answers, solutions to graded assignments, take-home test responses, or any material that violates your institution&apos;s academic integrity policy.</li>
            <li><strong>Copyrighted material:</strong> Textbook pages, publisher-owned content, or any material you do not have the right to distribute.</li>
            <li><strong>Harmful content:</strong> Harassment, hate speech, spam, or content that targets individuals.</li>
            <li><strong>Misleading content:</strong> Deliberately inaccurate notes intended to harm other students&apos; academic performance.</li>
          </ul>
          <p>
            We reserve the right to remove any content that violates these terms and to suspend or terminate accounts
            of repeat offenders, at our sole discretion.
          </p>
        </section>

        <section>
          <h2>5. User Content &amp; Ownership</h2>
          <p>
            You retain ownership of the notes and content you post on Illinotes. By posting content, you grant
            Illinotes a non-exclusive, royalty-free license to store, display, and distribute your content to other
            users of the platform as part of the normal operation of the service. This license ends when you delete
            your content or close your account.
          </p>
          <p>
            You are solely responsible for the content you post. Illinotes does not review all content before it is
            published and cannot guarantee the accuracy or educational quality of user-submitted notes.
          </p>
        </section>

        <section>
          <h2>6. Account Termination</h2>
          <p>
            We may suspend or terminate your account if you violate these Terms of Service, particularly with
            respect to academic integrity or prohibited content. You may close your account at any time by emailing{" "}
            <a href="mailto:illinotes67@gmail.com" className="text-[var(--terracotta)]">illinotes67@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>7. Disclaimer of Warranties</h2>
          <p>
            Illinotes is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied.
            We do not guarantee that the platform will be available at all times, free of errors, or that AI-generated
            content will be accurate. Use of AI Tutor and Summarizer features is at your own discretion; AI outputs
            should not be relied upon as a substitute for your own study and judgment.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, Illinotes and its operators shall not be liable for
            any indirect, incidental, special, or consequential damages arising from your use of the platform,
            including but not limited to academic penalties resulting from content found on the platform, loss of data,
            or service interruptions.
          </p>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will indicate the date of the most recent
            revision at the top of this page. Your continued use of Illinotes after any changes constitutes your
            acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            If you have questions about these Terms of Service or wish to report a violation, please contact us at{" "}
            <a href="mailto:illinotes67@gmail.com" className="text-[var(--terracotta)]">illinotes67@gmail.com</a>.
          </p>
        </section>

        <hr className="border-border" />
        <p>
          <Link href="/privacy" className="text-[var(--terracotta)] hover:underline">
            View our Privacy Policy →
          </Link>
        </p>
      </div>
    </div>
  )
}
