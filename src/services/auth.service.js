import axios from 'axios'

const authApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
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
