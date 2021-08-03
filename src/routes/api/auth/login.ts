import bcrypt from 'bcrypt'
import prisma from '$lib/services/prisma'

import type { Admin } from '@prisma/client'
import type { Request, Response, EndpointOutput } from '@sveltejs/kit'
import { signAndAttachCookieToHeader } from '$lib/services/jwt'

export async function post(
  req: Request,
  res: Response
): Promise<EndpointOutput> {
  const { email, password } = req.body as any
  let admin: Admin
  try {
    admin = await prisma.admin.findFirst({
      where: {
        email
      }
    })
    const validPassword = bcrypt.compareSync(password, admin.password)
    if (!validPassword) {
      throw new Error()
    }
  } catch (e) {
    console.error(e)
    return {
      status: 400,
      body: { message: 'Invalid email or password' }
    }
  }
  const headers = signAndAttachCookieToHeader({ userId: admin.id })
  return {
    status: 200,
    headers,
    body: { message: `logged in as ${email}` }
  }
}
