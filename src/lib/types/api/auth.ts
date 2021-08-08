import type { JSONBody } from './_common'
import type { Seller } from '@prisma/client'
import type { ValidationErrors } from '$lib/utils/validation/signup'

export type Auth_Login_Post_Body = {
  emailOrUsername: string
  password: string
}
export type Auth_Login_Post_Endpoint = JSONBody<Partial<Seller>>

export type Auth_Signup_Post_Body = {
  username: string
  email: string
  password: string
  confirmPassword: string
}
export type Auth_Signup_Post_Endpoint =
  | JSONBody<Partial<Seller>> & {
      errors?: ValidationErrors
    }
