import bcrypt from 'bcrypt'
import prisma from '$lib/services/prisma'
import { publicBucket } from '$lib/services/storage'
import { updateBodyToSelect } from '$lib/utils/api'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type {
  Seller_Get_Endpoint,
  Seller_Put_Body,
  Seller_Put_Endpoint
} from '$lib/types/api'

import type { Seller } from '@prisma/client'
import { SALT_ROUNDS } from '$lib/constants'

export async function get(
  req: Request
): Promise<EndpointOutput<Seller_Get_Endpoint>> {
  const username = req.query.get('username')
  if (!username) {
    return {
      status: 400,
      body: {
        message: 'Missing parameter [username]'
      }
    }
  }
  let seller: Seller
  try {
    seller = await prisma.seller.findFirst({
      where: {
        username
      },
      rejectOnNotFound: true
    })
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

export async function put(
  req: Request<Locals, Seller_Put_Body>
): Promise<EndpointOutput<Seller_Put_Endpoint>> {
  const { seller } = req.locals
  if (!seller) {
    return {
      status: 403
    }
  }
  const { username } = seller
  const rawUpdateBody = req.body
  const updateBody: Partial<Seller> = {}

  // TODO: validate all fields

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
  const select = updateBodyToSelect<Seller>(updateBody)

  try {
    const seller = await prisma.seller.update({
      select,
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
