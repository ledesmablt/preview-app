import type { Locals, RequestHandler } from '@sveltejs/kit'
import { respond } from '$lib/graphql/server'

export const del: RequestHandler<Locals> = (req) => respond(req)
export const get: RequestHandler<Locals> = (req) => respond(req)
export const head: RequestHandler<Locals> = (req) => respond(req)
export const post: RequestHandler<Locals> = (req) => respond(req)
export const put: RequestHandler<Locals> = (req) => respond(req)
