import leoProfanity from "leo-profanity"

// Load full dictionary on module init
leoProfanity.loadDictionary("en")

/**
 * Check if any of the provided strings contain profanity (word-boundary check).
 */
export function hasProfanity(...texts: (string | null | undefined)[]): boolean {
  return texts.some((t) => t && leoProfanity.check(t))
}

/**
 * Check profanity including substring matching — catches words like "fuckman".
 * Used for usernames and display names.
 */
export function hasProfanitySubstring(...texts: (string | null | undefined)[]): boolean {
  for (const t of texts) {
    if (!t) continue
    if (leoProfanity.check(t)) return true
    // Space-separate characters so library can match embedded swear words
    const spaced = t.split("").join(" ")
    if (leoProfanity.check(spaced)) return true
  }
  return false
}
