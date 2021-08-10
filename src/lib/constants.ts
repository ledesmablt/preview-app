import type { CookieOptions } from 'express'

export const SALT_ROUNDS = 10
export const EXPIRES_SECONDS = 10 * 60

export const DEFAULT_COOKIE: CookieOptions = {
  sameSite: 'strict',
  secure: true,
  httpOnly: true,
  path: '/'
}

export const NO_CACHE = 'no-cache, max-age=0'
