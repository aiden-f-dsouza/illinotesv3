import { readFileSync, readdirSync } from "fs"
import { join } from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

const BLOG_DIR = join(process.cwd(), "content", "blog")

function getAllSlugs(): string[] {
  try {
    return readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map((f) => {
        const src = readFileSync(join(BLOG_DIR, f), "utf8")
        const { data } = matter(src)
        return data.slug || f.replace(".md", "")
      })
  } catch {
    return []
  }
}

function getPost(slug: string) {
  let files: string[] = []
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  } catch {
    return null
  }

  for (const filename of files) {
    const src = readFileSync(join(BLOG_DIR, filename), "utf8")
    const { data, content } = matter(src)
    const postSlug = data.slug || filename.replace(".md", "")
    if (postSlug === slug) {
      return { data, content }
    }
  }
  return null
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  return { title: post?.data.title || "Blog Post" }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(post.content)
  const html = processed.toString()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[var(--terracotta)] transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Back to blog
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-4 leading-tight">{post.data.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{post.data.author || "Illinotes Team"}</span>
            {post.data.date && (
              <>
                <span>·</span>
                <span>
                  {new Date(post.data.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </header>

        <div
          className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-[var(--terracotta)] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  )
}
