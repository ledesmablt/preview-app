import bcrypt from 'bcrypt'
import prisma from '$lib/services/prisma'

import type { Seller } from '@prisma/client'
import type { Request, Response, EndpointOutput } from '@sveltejs/kit'
import { signAndAttachCookieToHeader } from '$lib/services/jwt'

export async function post(
  req: Request,
  res: Response
): Promise<EndpointOutput> {
  const { emailOrUsername, password } = req.body as any
  let seller: Seller | null
  try {
    seller = await prisma.seller.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          {
            username: emailOrUsername
          }
        ]
      }
    })
    if (!seller) {
      throw new Error('Seller not found')
    }
    const validPassword = bcrypt.compareSync(password, seller.password)
    if (!validPassword) {
      throw new Error('Invalid password')
    }
    req.locals.seller = seller
  } catch (e) {
    console.error(e)
    return {
      status: 400,
      body: { message: 'Invalid email or password' }
    }
  }
  const headers = signAndAttachCookieToHeader({ userId: seller.id })
  return {
    status: 200,
    headers,
    body: { message: `Logged in as ${emailOrUsername}` }
  }
}
