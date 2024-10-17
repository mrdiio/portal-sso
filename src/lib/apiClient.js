import axios from 'axios'
import { getSession } from 'next-auth/react'

const apiClient = axios.create({
  baseURL: '/sso',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession()

  const accessToken = session?.accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

export default apiClient
