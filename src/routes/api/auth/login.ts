import bcrypt from 'bcrypt'
import prisma from '$lib/services/prisma'

import type { Seller } from '@prisma/client'
import type { Request, Response, EndpointOutput } from '@sveltejs/kit'
import { signAndAttachCookieToHeader } from '$lib/services/jwt'

export async function post(
  req: Request,
  res: Response
): Promise<EndpointOutput> {
  const { email, password } = req.body as any
  let seller: Seller
  try {
    seller = await prisma.seller.findFirst({
      where: {
        email
      }
    })
    const validPassword = bcrypt.compareSync(password, seller.password)
    if (!validPassword) {
      throw new Error()
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
    body: { message: `logged in as ${email}` }
  }
}
