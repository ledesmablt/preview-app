import type { JSONValue } from '@sveltejs/kit/types/endpoint'

export type JSONBody<T extends JSONValue> = {
  message?: string
  data?: T
}
