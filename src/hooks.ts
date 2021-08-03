import { isLoggedIn, deleteCookieFromHeader } from '$lib/services/jwt'
import type { Request, EndpointOutput } from '@sveltejs/kit'
import type { Admin } from '@prisma/client'

interface Args {
  request: Request
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
    request.locals.admin = null
    return response
  }
  return await checkSession({ request, resolve })
}

export function getSession(request: Request) {
  return request.locals || {}
}

async function checkSession({
  request,
  resolve
}: Args): Promise<EndpointOutput> {
  let admin: Admin
  try {
    admin = await isLoggedIn(request)
    request.locals.admin = admin
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
