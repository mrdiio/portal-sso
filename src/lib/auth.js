import { loginService, refreshTokenService } from '@/services/auth.service'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as fs from 'fs'
import jwt from 'jsonwebtoken'
import { set } from 'react-hook-form'

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
        const expiresIn = parsed.expiresIn

        const jwtPayload = jwt.verify(accessToken, publicKey)

        const payload = {
          sub: jwtPayload.sub,
          name: jwtPayload.name,
          email: jwtPayload.email,
          expiresIn,
        }

        return {
          user: payload,
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
        const payload = {
          sub: user.sub,
          name: user.name,
          email: user.email,
          expiresIn: user.expiresIn,
        }

        token.user = payload
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      if (new Date().getTime() < token.user.expiresIn) {
        return token
      }

      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user = token.user
      session.error = token.error || null

      return session
    },
  },
}

async function refreshAccessToken(token) {
  try {
    const res = await refreshTokenService(token.refreshToken)

    const setCookie = res.headers['set-cookie']
    const cookie = decodeURIComponent(setCookie[0])

    const jsonString = cookie.split('auth-cookie=s:j:')[1].split('}.')[0] + '}'
    const parsed = JSON.parse(jsonString)

    const accessToken = parsed.accessToken
    const refreshToken = parsed.refreshToken
    const expiresIn = parsed.expiresIn

    const jwtPayload = jwt.verify(accessToken, publicKey)

    const payload = {
      sub: jwtPayload.sub,
      name: jwtPayload.name,
      email: jwtPayload.email,
      expiresIn,
    }

    return {
      user: payload,
      accessToken,
      refreshToken,
    }
  } catch (error) {
    console.log('error refresh', error.response.data)

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}
