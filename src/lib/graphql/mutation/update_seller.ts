import bcrypt from 'bcrypt'
import { GraphQLString, GraphQLFieldConfig } from 'graphql'
import { seller } from '../types'
import prisma from '$lib/services/prisma'
import type { GraphQLContext } from '../server'
import type { Seller } from '@prisma/client'
import { SALT_ROUNDS } from '$lib/constants'
import { updateBodyToSelect } from '$lib/utils/api'
import { publicBucket } from '$lib/services/storage'

const update_seller: GraphQLFieldConfig<any, GraphQLContext, any> = {
  args: {
    username: { type: GraphQLString },
    bio: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    userImageDraftId: { type: GraphQLString }
  },
  type: seller,
  async resolve(_source, args, ctx) {
    if (!ctx.seller) {
      throw new Error('Unauthorized')
    }
    const { username } = ctx.seller
    const updateBody: Partial<Seller> = {}

    // TODO: validate all fields

    if (args.bio) {
      updateBody.bio = args.bio
    }
    if (args.username) {
      updateBody.username = args.username
    }
    if (args.email) {
      updateBody.email = args.email
    }
    if (args.password) {
      updateBody.password = await bcrypt.hash(args.password, SALT_ROUNDS)
    }
    const select = updateBodyToSelect<Seller>(updateBody)

    let updatedSeller: Partial<Seller> = {}
    if (Object.keys(select).length > 0) {
      updatedSeller = await prisma.seller.update({
        select,
        where: { username },
        data: updateBody
      })
    }

    if (args.userImageDraftId) {
      const userImageStoragePath = `sellers/${username}/userImage`
      const draftPrefix = `${userImageStoragePath}.draft`
      const draftFile = publicBucket.file(
        `${draftPrefix}-${args.userImageDraftId}`
      )
      const [exists] = await draftFile.exists()
      if (exists) {
        await draftFile.move(userImageStoragePath)
      }
    }
    return updatedSeller
  }
}

export default update_seller
