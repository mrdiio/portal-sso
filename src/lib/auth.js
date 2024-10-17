import { loginService } from '@/services/auth.service'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as fs from 'fs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const publicKey = fs
  .readFileSync(process.cwd() + '/src/app/public-key.pub')
  .toString()

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials
        const res = await loginService(email, password)

        const setCookie = res.headers['set-cookie']

        const cookie = decodeURIComponent(setCookie[0])

        const jsonString =
          cookie.split('auth-cookie=s:j:')[1].split('}.')[0] + '}'
        const parsed = JSON.parse(jsonString)

        const accessToken = parsed.accessToken
        const refreshToken = parsed.refreshToken

        const jwtPayload = jwt.verify(accessToken, publicKey)

        return {
          id: jwtPayload.sub,
          name: jwtPayload.name,
          email: jwtPayload.email,
          expiresIn: jwtPayload.exp,
          accessToken,
          refreshToken,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresIn = user.expiresIn
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken

      return session
    },
  },
}
