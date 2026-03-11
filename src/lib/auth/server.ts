import { createClient } from "@/lib/supabase/server"
import type { UserWithProfile } from "@/types"

/**
 * Get current authenticated user with profile data (admin status, username, display_name).
 * Returns null if not authenticated.
 */
export async function getUserWithProfile(): Promise<UserWithProfile | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null

  // Fetch profile from Supabase (RLS-protected)
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, username, display_name")
    .eq("id", user.id)
    .single()

  const username = profile?.username?.trim() || user.email || user.id
  const displayName = profile?.display_name?.trim() || username

  return {
    id: user.id,
    email: user.email || "",
    username,
    displayName,
    isAdmin: profile?.is_admin ?? false,
  }
}
