import type { Request, Response, EndpointOutput, Locals } from '@sveltejs/kit'

export async function get(req: Request<Locals>): Promise<EndpointOutput> {
  const { seller } = req.locals
  if (!seller) {
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
