import { ProductNavbar } from "@/components/layout/ProductNavbar"
import { getUserWithProfile } from "@/lib/auth/server"

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserWithProfile()
  const navUser = user ? { displayName: user.displayName, username: user.username } : null

  return (
    <>
      <ProductNavbar user={navUser} />
      {children}
    </>
  )
}
