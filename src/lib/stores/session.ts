import { session as appSession } from '$app/stores'
import type { Seller } from '@prisma/client'
import type { Writable } from 'svelte/store'

export interface Session {
  seller?: Partial<Seller> | null
}

const session: Writable<Session> = appSession
export default session
