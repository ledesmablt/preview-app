import type { EndpointOutput } from '@sveltejs/kit'

export function post(): EndpointOutput {
  return {
    headers: {
      'set-cookie': 'token=deleted; path=/'
    }
  }
}
