import type { RequestHandler, Response } from '@sveltejs/kit'
import { getGraphQLParameters } from 'graphql-helix/dist/get-graphql-parameters.js'
import { processRequest } from 'graphql-helix/dist/process-request.js'
import { renderGraphiQL } from 'graphql-helix/dist/render-graphiql.js'
import { shouldRenderGraphiQL } from 'graphql-helix/dist/should-render-graphiql.js'

import { createSchema } from './schema'

const schemaPromise = createSchema()

const respond = async (request: any): Promise<Response> => {
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
    // For example, auth information is put in context for the resolver
    contextFactory: () => ({
      authorization:
        request.headers['Authorization'] ?? request.headers['authorization']
    }),
    request,
    schema: await schemaPromise
  })

  if (result.type === 'RESPONSE') {
    const headers: Record<string, string> = {}

    for (const { name, value } of result.headers) {
      headers[name] = value
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
