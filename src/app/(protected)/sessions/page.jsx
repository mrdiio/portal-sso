import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export default async function Page() {
  const session = await getServerSession(authOptions)
  return (
    <div>
      Session data
      {session ? (
        <>
          <div>Nama : {session.user.name}</div>
          <div>Email : {session.user.email}</div>
        </>
      ) : (
        <div>
          <p>No session</p>
        </div>
      )}
    </div>
  )
}
