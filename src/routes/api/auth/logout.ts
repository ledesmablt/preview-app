import type { EndpointOutput } from '@sveltejs/kit'

import { deleteCookieFromHeader } from '$lib/services/jwt'

export function post(): EndpointOutput {
  const headers = deleteCookieFromHeader()
  return {
    headers
  }
}
