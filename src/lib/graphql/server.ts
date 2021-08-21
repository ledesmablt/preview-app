import type { Request, Locals, Response } from '@sveltejs/kit'
import type { Session } from '$lib/stores/session'
import { getGraphQLParameters } from 'graphql-helix/dist/get-graphql-parameters.js'
import { processRequest } from 'graphql-helix/dist/process-request.js'
import { renderGraphiQL } from 'graphql-helix/dist/render-graphiql.js'
import { shouldRenderGraphiQL } from 'graphql-helix/dist/should-render-graphiql.js'

import { createSchema } from './schema'
import { isLoggedIn, setTokenAsCookie } from '$lib/services/jwt'

const schemaPromise = createSchema()

export type GraphQLContext = Session & {
  token?: string
}

export const respond = async (request: Request<Locals>): Promise<Response> => {
  if (
    !request.body &&
    request.method === 'GET' &&
    shouldRenderGraphiQL(request)
  )
    return {
      body: renderGraphiQL(),
      headers: { 'Content-Type': 'text/html' },
      status: 200
    }

  // Workaround for a bug with body parsing in SvelteKit
  if (typeof request.body === 'string') request.body = JSON.parse(request.body)

  const parameters = getGraphQLParameters(request)
  const result = await processRequest({
    ...parameters,
    contextFactory: async (): Promise<GraphQLContext> => {
      const seller = await isLoggedIn(request)
      return {
        seller
      }
    },
    request,
    schema: await schemaPromise
  })

  if (result.type === 'RESPONSE') {
    const headers: Record<string, string> = {}

    for (const { name, value } of result.headers) {
      headers[name] = value
    }

    // login operations
    if (result.context?.token) {
      setTokenAsCookie(result.context.token, headers)
    }
    if (result.context?.seller) {
      request.locals.seller = result.context.seller
    }
    return {
      body: result.payload as any,
      headers,
      status: result.status
    }
  }

  return {
    // Think you could help? https://github.com/svelte-add/graphql/issues/1
    body: "svelte-add/graphql doesn't support multipart responses or event streams",
    headers: {},
    status: 501
  }
}
