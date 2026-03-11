import Link from "next/link"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"
import matter from "gray-matter"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Blog" }

interface Post {
  slug: string
  title: string
  author: string
  date: string
  excerpt: string
}

function getBlogPosts(): Post[] {
  const blogDir = join(process.cwd(), "content", "blog")
  let files: string[] = []
  try {
    files = readdirSync(blogDir).filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  } catch {
    return []
  }

  return files
    .map((filename) => {
      const source = readFileSync(join(blogDir, filename), "utf8")
      const { data, content } = matter(source)
      return {
        slug: data.slug || filename.replace(".md", ""),
        title: data.title || "Untitled",
        author: data.author || "IlliNotes Team",
        date: data.date || "",
        excerpt: content.trim().slice(0, 200).replace(/[#*_]/g, "") + "…",
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-10">Updates and insights from the IlliNotes team.</p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow note-card-accent">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-[var(--terracotta)] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>
                        {post.date
                          ? new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-muted-foreground group-hover:text-[var(--terracotta)] transition-colors shrink-0 mt-1"
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
