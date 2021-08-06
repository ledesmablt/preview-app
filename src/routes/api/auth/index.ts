import type { Request, Response, EndpointOutput } from '@sveltejs/kit'

import { isLoggedIn } from '$lib/services/jwt'
import type { Seller } from '@prisma/client'

export async function get(
  req: Request,
  res: Response
): Promise<EndpointOutput> {
  let seller: Seller | null
  try {
    seller = await isLoggedIn(req)
  } catch (err) {
    return {
      status: 401,
      headers: {
        'set-cookie': 'token=deleted; path=/'
      }
    }
  }
  if (!seller) {
    return {
      status: 404
    }
  }
  const { email, id } = seller
  return {
    body: {
      message: `logged in as ${email}`,
      data: {
        id,
        email
      }
    }
  }
}
