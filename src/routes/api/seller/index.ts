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

  let updatedSeller: Partial<Seller> = {}
  if (Object.keys(select).length > 0) {
    try {
      updatedSeller = await prisma.seller.update({
        select,
        where: { username },
        data: updateBody
      })
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

  if (req.body.userImageDraftId) {
    const userImageStoragePath = `sellers/${seller.username}/userImage`
    const draftPrefix = `${userImageStoragePath}.draft`
    const draftFile = publicBucket.file(
      `${draftPrefix}-${req.body.userImageDraftId}`
    )
    const [exists] = await draftFile.exists()
    if (exists) {
      await draftFile.move(userImageStoragePath)
    }
  }
  return {
    body: {
      data: updatedSeller
    }
  }
}
