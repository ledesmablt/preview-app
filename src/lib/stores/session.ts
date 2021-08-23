import { session as appSession } from '$app/stores'
import type { Writable } from 'svelte/store'

import type { Locals } from '@sveltejs/kit'

export type Session = Locals

const session: Writable<Session> = appSession
export default session
