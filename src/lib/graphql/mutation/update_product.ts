import {
  GraphQLString,
  GraphQLFloat,
  GraphQLFieldConfig,
  GraphQLBoolean
} from 'graphql'
import { product } from '../types'
import prisma from '$lib/services/prisma'
import type { GraphQLContext } from '../server'
import type { Product } from '@prisma/client'
import { sellerOwnsProduct } from '$lib/utils/api'
import { privateBucket, publicBucket } from '$lib/services/storage'
import type { Bucket } from '@google-cloud/storage'

const update_product: GraphQLFieldConfig<any, GraphQLContext, any> = {
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    enabled: { type: GraphQLBoolean },
    imageDraftId: { type: GraphQLString },
    audioPreviewDraftId: { type: GraphQLString },
    audioProductDraftId: { type: GraphQLString }
  },
  type: product,
  async resolve(_source, args, ctx) {
    if (!ctx.seller) {
      throw new Error('Unauthorized')
    }
    await sellerOwnsProduct(ctx.seller, args.id)

    // TODO: validate all fields

    const updateBody: Partial<Product> = {}
    if (args.name) {
      updateBody.name = args.name
    }
    if (args.description) {
      updateBody.description = args.description
    }
    if (args.price) {
      updateBody.price = args.price
    }
    if (args.currency) {
      updateBody.currency = args.currency
    }
    if (typeof args.enabled === 'boolean') {
      updateBody.enabled = args.enabled
    }

    let updatedProduct: Partial<Product> = {}
    if (Object.keys(updateBody).length > 0) {
      updatedProduct = await prisma.product.update({
        where: {
          id: args.id
        },
        data: updateBody
      })
    }

    const replaceIfDraftExists = async (
      storagePath: string,
      bucket: Bucket,
      draftId?: string
    ) => {
      if (!draftId) {
        return
      }
      const draftPrefix = `${storagePath}.draft`
      const draft = bucket.file(`${draftPrefix}-${draftId}`)
      const [exists] = await draft.exists()
      if (exists) {
        await draft.move(storagePath)
      }
    }

    await Promise.all([
      replaceIfDraftExists(
        `products/${args.id}/displayImage`,
        publicBucket,
        args.imageDraftId
      ),
      replaceIfDraftExists(
        `products/${args.id}/audioPreview`,
        publicBucket,
        args.audioPreviewDraftId
      ),
      replaceIfDraftExists(
        `products/${args.id}/audioProduct`,
        privateBucket,
        args.audioProductDraftId
      )
    ])
    return updatedProduct
  }
}

export default update_product
