import { Footer } from "@/components/layout/Footer"
import { AIChatWidget } from "@/components/chat/AIChatWidget"
import { getUserWithProfile } from "@/lib/auth/server"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserWithProfile()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatWidget isLoggedIn={!!user} />
    </div>
  )
}
