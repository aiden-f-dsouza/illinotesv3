import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function extractHashtags(text: string): string[] {
  return (text.match(/#[\w-]+/g) || []).map((t) => t.slice(1))
}

export function extractMentions(text: string): string[] {
  return (text.match(/@([a-zA-Z0-9_]{3,20})/g) || []).map((m) => m.slice(1))
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getFileIcon(fileType: string): string {
  const ext = fileType.toLowerCase()
  if (ext === "pdf") return "file-pdf"
  if (["png", "jpg", "jpeg", "gif"].includes(ext)) return "image"
  if (["doc", "docx"].includes(ext)) return "file-doc"
  if (["ppt", "pptx"].includes(ext)) return "file-ppt"
  if (ext === "txt") return "file-text"
  return "file"
}

export const PAGE_SIZE = 5

export const ALLOWED_EXTENSIONS = new Set([
  "pdf", "png", "jpg", "jpeg", "gif",
  "doc", "docx", "txt", "ppt", "pptx",
])

export function isAllowedFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase()
  return ext ? ALLOWED_EXTENSIONS.has(ext) : false
}
