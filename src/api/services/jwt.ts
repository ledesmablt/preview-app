import * as jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import type { Admin } from '@prisma/client'

import prisma from '../services/prisma'
import { DEFAULT_COOKIE } from '../constants'

interface TokenPayload extends jwt.JwtPayload {
  userId: string
}

const JWT_SECRET = process.env.JWT_SECRET ?? ''

function verifyToken(token: string) {
  let payload: TokenPayload
  try {
    payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    return {
      token,
      payload
    }
  } catch (error) {
    throw Error
    // TODO: implement better jwt refresh w/ cookies + header
    // if (error instanceof jwt.TokenExpiredError) {
    //   return signToken(payload)
    // }
    // throw error
  }
}

export function isLoggedIn(req: Request): boolean {
  const token = getTokenFromRequest(req)
  try {
    verifyToken(token)
    return true
  } catch (e) {
    return false
  }
}

function getTokenFromRequest(req: Request): string | undefined {
  const headerMatch = /Bearer (.*)/.exec(req.headers.authorization ?? '')
  if (headerMatch) {
    return headerMatch[1].toString()
  } else {
    return req.cookies?.token as string | undefined
  }
}

function attachTokenToResponse(token: string, res: Response): void {
  res.cookie('token', token, DEFAULT_COOKIE)
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

export const jwtMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getTokenFromRequest(req)
  if (!token) {
    return res.status(401).json({ error: 'Missing token' })
  }
  let admin: Admin
  try {
    const { token: updatedToken, payload } = verifyToken(token)
    attachTokenToResponse(updatedToken, res)
    admin = await prisma.admin.findUnique({ where: { id: payload.userId } })
    res.locals.admin = admin
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
  return next()
}
