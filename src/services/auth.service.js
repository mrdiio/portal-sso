import axios from 'axios'
import { cookies } from 'next/headers'

const authApi = axios.create({
  baseURL: `${process.env.NEXTAUTH_URL}/sso/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const loginService = async (email, password) => {
  try {
    const response = await authApi.post('/local/login', {
      email,
      password,
    })

    return response
  } catch (error) {
    throw new Error(error.response.data?.message)
  }
}

export const refreshTokenService = async (refreshToken) => {
  const res = await authApi.get('/refresh', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  })

  return res
}
