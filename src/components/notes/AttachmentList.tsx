import { FilePdf, Image, FileDoc, FileText, File } from "@phosphor-icons/react/dist/ssr"
import type { Attachment } from "@/types"
import Link from "next/link"

function FileIcon({ fileType }: { fileType: string }) {
  const ext = fileType.toLowerCase()
  if (ext === "pdf") return <FilePdf size={14} className="text-red-500" />
  if (["png", "jpg", "jpeg", "gif"].includes(ext)) return <Image size={14} className="text-blue-500" />
  if (["doc", "docx"].includes(ext)) return <FileDoc size={14} className="text-blue-600" />
  if (ext === "txt") return <FileText size={14} className="text-gray-500" />
  return <File size={14} className="text-gray-400" />
}

interface Props {
  attachments: Attachment[]
}

export function AttachmentList({ attachments }: Props) {
  if (attachments.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {attachments.map((att) => (
        <Link
          key={att.id}
          href={`/api/download/${att.id}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--terracotta)]/10 text-[var(--terracotta)] border border-[var(--terracotta)]/20 hover:bg-[var(--terracotta)]/15 transition-colors"
        >
          <FileIcon fileType={att.file_type} />
          <span className="max-w-[180px] truncate">{att.original_filename}</span>
        </Link>
      ))}
    </div>
  )
}
