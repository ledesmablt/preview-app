import type { CookieOptions } from 'express'

export const SALT_ROUNDS = 10

export const DEFAULT_COOKIE: CookieOptions = {
  sameSite: 'strict',
  secure: true,
  httpOnly: true,
  path: '/'
}
