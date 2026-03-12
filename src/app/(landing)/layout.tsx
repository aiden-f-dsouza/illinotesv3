import { LandingNavbar } from "@/components/layout/LandingNavbar"
import { Footer } from "@/components/layout/Footer"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
