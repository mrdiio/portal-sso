import { loginService } from '@/services/auth.service'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as fs from 'fs'
import jwt from 'jsonwebtoken'

const publicKey = fs
  .readFileSync(process.cwd() + '/src/app/public-key.pub')
  .toString()

// const publicKey = `-----BEGIN PUBLIC KEY-----
// MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAunA8cEIUIym/FzZmGs4j
// e1yoq+miSe8dYmj1oBmcAqGzqF4GPTMgn1M03cDEJErvdSFAv/D/sDDqNNQ9ZSpi
// wxKMdzqWTIdrhwrsFm23le9BGp714YRdtXDFQ6XI4AFTKqh79gPvb9+Fvd9dXjfI
// Oc7FynoLS5moLtICVMS/gxwVfy54DCx4pvxIks3PRg3nyx7rnEtPXUE7rO2cVyu+
// THdv/J1uaOsKfZfO6pOCxfHdFXdzlejr+xMRQ8FGpjt9up+4EBtF4GXHBA4A9ppR
// TJLDvK+WBtw38ChAl7LT1Yike1GL/a+snBXAVhMD5M7Jr3HH3oCu/8tMjTRdBLKC
// LJlcRQ8KB6QegD+O+leIC3aycusHJyjQ3I1DZWnjhoHWZhQrAFPFcB/ftqbX3iP5
// sDM3mRSJhruI+IkBy/PJuREclxizQbhWtpeIqGqVNK45YAUrQfzW8BaTFkhNUMpQ
// jILhV+QlbCdjGn6GvB9x1YTXTg5xVnFUSd0E8OptoPXHM9J5ZyIYQxStewrjTT+j
// O1MODsyHXFCc1sbylbryCmP5GX6KFMUxEMcVKsV0dCOY2dTCDUVXg/wj0Gp7bkQR
// eumNclQ5Gd9wbnSwNYlCxWZiMGfx2T/ZoPVX/vntPFtPG+JBZ02jC6VlmFezAwxL
// 1RZ1P7OQTt8hVLdws7noGhUCAwEAAQ==
// -----END PUBLIC KEY-----
// `

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
    async jwt({ token, user, account }) {
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
