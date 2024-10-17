import FormSignIn from '@/components/auth/formSignIn'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Home({ searchParams }) {
  const session = await getServerSession(authOptions)

  if (session) {
    if (searchParams['redirectUrl']) {
      redirect(`${searchParams['redirectUrl']}?token=${session.accessToken}`)
    } else {
      redirect(searchParams['redirectUrl'] || '/sessions')
    }
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-5">
      <div className="container max-w-lg sm:py-10 p-6 border-none rounded-md bg-white shadow-md">
        <div className="pb-4">
          <span className="text-slate-400">Welcome</span>
          <h1 className="text-2xl font-medium text-primary">
            Sign in to your account
          </h1>
        </div>

        <FormSignIn session={session} />
      </div>
    </main>
  )
}
