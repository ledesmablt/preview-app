import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import type { Request } from '@sveltejs/kit'
import type { Headers } from '@sveltejs/kit/types/helper'
import type { Seller } from '@prisma/client'

import prisma from '$lib/services/prisma'
import { DEFAULT_COOKIE } from '$lib/constants'

interface TokenPayload extends jwt.JwtPayload {
  userId: string
}
interface SignTokenOptions {
  duration?: string
  asCookie?: boolean
}

const JWT_SECRET = (import.meta.env.VITE_JWT_SECRET || '') as string

function verifyToken(token: string) {
  let payload: TokenPayload
  payload = jwt.verify(token, JWT_SECRET) as TokenPayload
  return {
    token,
    payload
  }
}
function getTokenFromRequest({ headers }: Request): string {
  const headerMatch = /Bearer (.*)/.exec(headers.authorization || '')
  if (headerMatch) {
    return headerMatch[1].toString()
  } else {
    return cookie.parse(headers.cookie || '').token
  }
}

export async function isLoggedIn(req: Request): Promise<Seller | null> {
  const token = getTokenFromRequest(req)
  let payload: TokenPayload
  try {
    payload = verifyToken(token).payload
  } catch (e) {
    throw e
  }
  const seller = await prisma.seller.findFirst({
    where: {
      id: payload.userId
    }
  })
  return seller
}

export function signToken(
  payload: TokenPayload,
  { duration = '10m', asCookie = false }: SignTokenOptions
): string {
  const token = jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: duration
  })
  if (asCookie) {
    return cookie.serialize('token', token, DEFAULT_COOKIE)
  }
  return token
}

export function attachCookieToHeader(
  cookie: string,
  header: Headers = {}
): Headers {
  return {
    ...header,
    'set-cookie': cookie
  }
}

export function signAndAttachCookieToHeader(
  payload: TokenPayload,
  header?: Headers
): Headers {
  const cookie = signToken(payload, { asCookie: true })
  return attachCookieToHeader(cookie, header)
}

export function deleteCookieFromHeader(header: Headers = {}): Headers {
  return {
    ...header,
    'set-cookie': cookie.serialize('token', '', {
      path: '/',
      expires: new Date()
    })
  }
}
