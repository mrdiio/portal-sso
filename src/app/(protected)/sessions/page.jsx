import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Profile from './profile'

export default async function Page() {
  const session = await getServerSession(authOptions)
  return (
    <div>
      Session data
      {session ? (
        <>
          <Profile />
        </>
      ) : (
        <div>
          <p>No session</p>
        </div>
      )}
    </div>
  )
}
