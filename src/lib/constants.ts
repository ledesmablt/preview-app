import type { CookieOptions } from 'express'

export const SALT_ROUNDS = 10

export const DEFAULT_COOKIE: CookieOptions = {
  maxAge: 86400 * 1000,
  sameSite: true,
  secure: true
}
