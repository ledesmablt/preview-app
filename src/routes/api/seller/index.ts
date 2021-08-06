import prisma from '$lib/services/prisma'
import { publicBucket } from '$lib/services/storage'
import type { Request, Response, EndpointOutput } from '@sveltejs/kit'

import type { Seller } from '@prisma/client'

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
