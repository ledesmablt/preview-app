import { AuthenticationError } from 'apollo-server-express'

import { isLoggedIn } from '../services/jwt'

export function mustBeLoggedIn(context): void {
  if (!isLoggedIn(context.req)) {
    throw new AuthenticationError('Not logged in!')
  }
}
