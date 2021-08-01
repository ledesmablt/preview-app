import { writable } from 'svelte/store'
import type { Admin } from '@prisma/client'

export interface Session {
  loading: boolean
  admin?: Partial<Admin>
}

export const sessionStore = writable<Session>({
  loading: true
})
