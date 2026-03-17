import { ContentNavbar } from "@/components/layout/ContentNavbar"

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ContentNavbar />
      {children}
    </>
  )
}
