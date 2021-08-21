import type { RequestHandler } from 'express-serve-static-core'
import { respond } from '$lib/graphql/server'

export const del: RequestHandler = ({ body, headers, query }) =>
  respond({ body, headers, method: 'DELETE', query })
export const get: RequestHandler = ({ body, headers, query }) =>
  respond({ body, headers, method: 'GET', query })
export const head: RequestHandler = ({ body, headers, query }) =>
  respond({ body, headers, method: 'HEAD', query })
export const post: RequestHandler = ({ body, headers, query }) =>
  respond({ body, headers, method: 'POST', query })
export const put: RequestHandler = ({ body, headers, query }) =>
  respond({ body, headers, method: 'PUT', query })
