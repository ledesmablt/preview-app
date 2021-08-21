import { publicBucket } from '$lib/services/storage'
import { handleDraftUpload, sellerOwnsProduct } from '$lib/utils/api'
import { GraphQLFieldConfig, GraphQLString } from 'graphql'
import type { GraphQLContext } from '../server'
import { draftUploadFile } from '../types'

const upload_product_draft_display_image: GraphQLFieldConfig<
  any,
  GraphQLContext
> = {
  type: draftUploadFile,
  args: {
    id: { type: GraphQLString },
    contentType: { type: GraphQLString }
  },
  async resolve(_source, args, ctx) {
    if (!ctx.seller) {
      throw new Error('Unauthorized')
    }
    await sellerOwnsProduct(ctx.seller, args.id)
    const draftPrefix = `products/${args.id}/displayImage.draft`
    return await handleDraftUpload(draftPrefix, args.contentType, publicBucket)
  }
}

export default upload_product_draft_display_image
