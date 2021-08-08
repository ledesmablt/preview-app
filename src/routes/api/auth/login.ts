import bcrypt from 'bcrypt'
import prisma from '$lib/services/prisma'

import type { Seller } from '@prisma/client'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import { signAndAttachCookieToHeader } from '$lib/services/jwt'
import type {
  Auth_Login_Post_Body,
  Auth_Login_Post_Endpoint
} from '$lib/types/api'

export async function post(
  req: Request<Locals, Auth_Login_Post_Body>
): Promise<EndpointOutput<Auth_Login_Post_Endpoint>> {
  const { emailOrUsername, password = '' } = req.body
  let seller: Seller
  try {
    seller = await prisma.seller.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          {
            username: emailOrUsername
          }
        ]
      },
      rejectOnNotFound: true
    })
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
    body: { message: `Logged in as ${seller.username}`, data: seller }
  }
}
