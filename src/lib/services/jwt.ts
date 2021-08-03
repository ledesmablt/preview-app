import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import type { Request, Response } from '@sveltejs/kit'
import type { Admin } from '@prisma/client'

import prisma from '$lib/services/prisma'

interface TokenPayload extends jwt.JwtPayload {
  userId: string
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

export async function isLoggedIn(req: Request): Promise<Admin | undefined> {
  const token = getTokenFromRequest(req)
  let payload: TokenPayload
  try {
    payload = verifyToken(token).payload
  } catch (e) {
    return
  }

  const admin = await prisma.admin.findFirst({
    where: {
      id: payload.userId
    }
  })
  return admin
}

function getTokenFromRequest(req: Request): string | undefined {
  const headerMatch = /Bearer (.*)/.exec(req.headers.authorization || '')
  if (headerMatch) {
    return headerMatch[1].toString()
  } else {
    return cookie.parse(req.headers.cookie || '').token
  }
}

function attachTokenToResponse(token: string, res: Response): void {
  res.headers['set-cookie'] = cookie.serialize('token', token)
}

export function signToken(
  payload: TokenPayload,
  duration: string = '10m',
  res?: Response
): string {
  const token = jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: duration
  })
  if (res) {
    attachTokenToResponse(token, res)
  }
  return token
}
