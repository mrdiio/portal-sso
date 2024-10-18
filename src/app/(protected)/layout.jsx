import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (session?.error === 'RefreshAccessTokenError') {
    redirect('/api/auth/signout')
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 bg-muted/40 p-4 md:p-6">{children}</main>
    </div>
  )
}
