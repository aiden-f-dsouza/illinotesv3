import { Footer } from "@/components/layout/Footer"
import { AIChatWidget } from "@/components/chat/AIChatWidget"
import { createClient } from "@/lib/supabase/server"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatWidget isLoggedIn={!!user} />
    </div>
  )
}
