import { AuthenticationError } from 'apollo-server-lambda'
import type { Request } from '@sveltejs/kit'

import { isLoggedIn } from '$lib/services/jwt'

export function mustBeLoggedIn(req: Request): void {
  if (!isLoggedIn(req)) {
    throw new AuthenticationError('Not logged in!')
  }
}
