import type { Request, Response, EndpointOutput } from '@sveltejs/kit'

import { isLoggedIn } from '$lib/services/jwt'
import type { Admin } from '@prisma/client'

export async function get(
  req: Request,
  res: Response
): Promise<EndpointOutput> {
  let admin: Admin
  try {
    admin = await isLoggedIn(req)
  } catch (err) {
    return {
      status: 401,
      headers: {
        'set-cookie': 'token=deleted; path=/'
      }
    }
  }
  if (!admin) {
    return {
      status: 401
    }
  }
  const { email } = admin
  return {
    body: {
      message: `logged in as ${email}`,
      data: {
        email
      }
    }
  }
}
