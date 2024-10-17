'use client'
import { getProfileService } from '@/services/profile.service'
import { useQuery } from '@tanstack/react-query'

export default function Profile() {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfileService(),
  })

  return (
    <div>
      <div>
        {data ? (
          <div>
            <div>Nama : {data.data.name}</div>
            <div>Email : {data.data.email}</div>
          </div>
        ) : (
          <div>Loading gas...</div>
        )}
      </div>
    </div>
  )
}
