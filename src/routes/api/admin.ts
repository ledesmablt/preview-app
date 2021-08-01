import { isLoggedIn } from '$lib/services/jwt'
import type { Request, Response, EndpointOutput } from '@sveltejs/kit'

export async function get(
  req: Request,
  res: Response
): Promise<EndpointOutput> {
  if (await isLoggedIn(req)) {
    return { body: 'You are logged in!' }
  }
  return {
    status: 401
  }
}
