import { isLoggedIn, deleteCookieFromHeader } from '$lib/services/jwt'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type { Session } from '$lib/stores'

interface Args {
  request: Request<Locals>
  resolve: any
}

// fires after every page render / server request
export async function handle({
  request,
  resolve
}: Args): Promise<EndpointOutput> {
  if (request.path.startsWith('/graphql')) {
    // handle session checking in graphql handler
    return await resolve(request)
  }

  // check session
  try {
    const seller = await isLoggedIn(request)
    request.locals.seller = seller
    const response = await resolve(request)
    return response
  } catch (err) {
    const response = await resolve(request)
    const headers = deleteCookieFromHeader(response.headers)
    return {
      ...response,
      headers
    }
  }
}

export function getSession(request: Request<Locals>): Session {
  return request.locals || {}
}
