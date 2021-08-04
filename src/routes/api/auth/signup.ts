import bcrypt from 'bcrypt'
import prisma from '$lib/services/prisma'

import type { Seller } from '@prisma/client'
import type { Request, Response, EndpointOutput, Locals } from '@sveltejs/kit'
import { signAndAttachCookieToHeader } from '$lib/services/jwt'
import { validate } from '$lib/utils/validation/signup'
import { SALT_ROUNDS } from '$lib/constants'

interface Body {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export async function post(
  req: Request<Locals, Body>,
  res: Response
): Promise<EndpointOutput> {
  const { isValid, errors } = validate(req.body)
  if (!isValid) {
    return {
      status: 400,
      body: {
        errors: errors as any
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
