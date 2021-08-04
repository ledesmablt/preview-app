import { isLoggedIn, deleteCookieFromHeader } from '$lib/services/jwt'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type { Seller } from '@prisma/client'

interface Args {
  request: Request<Locals>
  resolve: any
}

// fires after every page render / server request
export async function handle({
  request,
  resolve
}: Args): Promise<EndpointOutput> {
  // don't check session for api routes
  if (request.path.startsWith('/api')) {
    return await resolve(request)
  }
  if (request.path === '/api/auth/logout') {
    const response = await resolve(request)
    request.locals.seller = null
    return response
  }
  return await checkSession({ request, resolve })
}

export function getSession(request: Request<Locals>) {
  return request.locals || {}
}

async function checkSession({
  request,
  resolve
}: Args): Promise<EndpointOutput> {
  let seller: Seller
  try {
    seller = await isLoggedIn(request)
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
