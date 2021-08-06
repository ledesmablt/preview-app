import bcrypt from 'bcrypt'
import prisma from '$lib/services/prisma'
import { publicBucket } from '$lib/services/storage'
import type { Request, Response, EndpointOutput } from '@sveltejs/kit'

import type { Seller } from '@prisma/client'
import { SALT_ROUNDS } from '$lib/constants'

export async function get(
  req: Request,
  res: Response
): Promise<EndpointOutput> {
  const username = req.query.get('username')
  if (!username) {
    return {
      status: 401,
      body: {
        message: 'Missing parameter [username]'
      }
    }
  }
  let seller: Seller | null
  try {
    seller = await prisma.seller.findFirst({
      where: {
        username
      }
    })
    if (!seller) {
      throw new Error('Seller not found')
    }
  } catch (err) {
    return {
      status: 404
    }
  }

  const { email, bio } = seller
  // TODO: get from db & handle file upload in PUT
  const [[file]] = await publicBucket.getFiles({
    prefix: `sellers/${username}/userImage`
  })
  return {
    body: {
      data: {
        email,
        bio,
        username,
        userImageUrl: file ? file.publicUrl() : null
      }
    }
  }
}

export async function put(req: Request): Promise<EndpointOutput> {
  // TODO: validate if actual user
  const { username, ...rawUpdateBody } = req.body as any
  if (!username) {
    return {
      status: 401,
      body: {
        message: 'Missing parameter [username]'
      }
    }
  }
  // TODO: validate all fields
  const updateBody: Partial<Seller> = {}
  if (rawUpdateBody.bio) {
    updateBody.bio = rawUpdateBody.bio
  }
  if (rawUpdateBody.username) {
    updateBody.username = rawUpdateBody.username
  }
  if (rawUpdateBody.email) {
    updateBody.email = rawUpdateBody.email
  }
  if (rawUpdateBody.password) {
    updateBody.password = await bcrypt.hash(rawUpdateBody.password, SALT_ROUNDS)
  }
  if (rawUpdateBody.image) {
    // TODO: do gcs upload
  }

  try {
    const seller = await prisma.seller.update({
      where: { username },
      data: updateBody
    })
    return {
      body: {
        data: seller
      }
    }
  } catch (err) {
    console.error(err)
    return {
      status: 400,
      body: {
        message: err.message
      }
    }
  }
}
