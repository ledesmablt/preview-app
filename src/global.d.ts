/// <reference types="@sveltejs/kit" />
import { Request as BaseRequest } from '@sveltejs/kit'

import type { Seller } from '@prisma/client'

declare module '@sveltejs/kit' {
  export interface Locals {
    seller?: Partial<Nullable<Seller>> | null
  }
}

type Nullable<T> = { [P in keyof T]: T[P] | null }
