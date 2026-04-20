export interface Note {
  id: number
  author: string
  title: string
  body: string
  class_code: string
  user_id: string
  tags: string | null
  score: number
  created: string // ISO date string
  attachments?: Attachment[]
  votes?: Vote[]
  comments?: Comment[]
  _count?: {
    comments: number
  }
}

export interface Attachment {
  id: number
  note_id: number
  filename: string
  original_filename: string
  file_type: string
  uploaded_at: string
  extracted_text?: string | null
}

export interface Vote {
  id: number
  note_id: number
  user_id: string
  value: number
  created: string
}

export interface Comment {
  id: number
  note_id: number
  author: string
  body: string
  user_id: string | null
  created: string
}

export interface Mention {
  id: number
  comment_id: number
  note_id: number
  mentioned_user_email: string
  mentioned_user_id: string | null
  mentioning_author: string
  is_read: boolean
  created: string
}

export interface Profile {
  id: string
  email: string
  username: string | null
  display_name: string | null
  is_admin: boolean
}

export interface UserWithProfile {
  id: string
  email: string
  username: string
  displayName: string
  isAdmin: boolean
}

export interface NoteFilters {
  class_filter?: string
  search?: string
  tag_filter?: string
  date_filter?: string
  sort_by?: string
  page?: number
}

export interface PaginatedNotes {
  notes: NoteWithCounts[]
  page: number
  pageSize: number
  hasMore: boolean
  total: number
}

export interface NoteWithCounts extends Note {
  score: number
  _count: {
    comments: number
  }
  attachments: Attachment[]
}

export interface TagCount {
  tag: string
  count: number
}

export interface LeaderboardEntry {
  user_id: string
  username: string
  display_name: string
  count: number
}
