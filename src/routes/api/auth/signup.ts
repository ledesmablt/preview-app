import bcrypt from 'bcrypt'
import prisma from '$lib/services/prisma'

import type { Seller } from '@prisma/client'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import { signAndAttachCookieToHeader } from '$lib/services/jwt'
import { validate } from '$lib/utils/validation/signup'
import { SALT_ROUNDS } from '$lib/constants'
import type {
  Auth_Signup_Post_Body,
  Auth_Signup_Post_Endpoint
} from '$lib/types/api'

export async function post(
  req: Request<Locals, Auth_Signup_Post_Body>
): Promise<EndpointOutput<Auth_Signup_Post_Endpoint>> {
  const { errors: validationErrors } = validate(req.body)
  if (validationErrors) {
    return {
      status: 400,
      body: {
        errors: validationErrors
      }
    }
  }
  const { username, email, password: rawPassword } = req.body
  let seller: Seller | null
  let existingSeller = await prisma.seller.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  })
  if (existingSeller) {
    return {
      status: 400,
      body: {
        message:
          `Account already exists for ` +
          (existingSeller.email === email
            ? `email ${email}`
            : `username ${username}`)
      }
    }
  }

  const password = await bcrypt.hash(rawPassword, SALT_ROUNDS)
  seller = await prisma.seller.create({
    data: {
      username,
      email,
      password
    }
  })
  req.locals.seller = seller

  const headers = signAndAttachCookieToHeader({ userId: seller.id })
  return {
    status: 200,
    headers,
    body: {
      message: `Successfully created account ${username} for ${email}`,
      data: seller
    }
  }
}
