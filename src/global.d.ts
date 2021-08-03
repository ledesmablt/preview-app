/// <reference types="@sveltejs/kit" />
import { Request as BaseRequest } from '@sveltejs/kit'

import type { Admin } from '@prisma/client'

declare module '@sveltejs/kit' {
  export interface Locals {
    admin?: Admin
  }
}
