import { publicBucket } from '$lib/services/storage'
import { handleDraftUpload } from '$lib/utils/api'
import { GraphQLFieldConfig, GraphQLString } from 'graphql'
import type { GraphQLContext } from '../server'
import { draftUploadFile } from '../types'

const upload_seller_draft_user_image: GraphQLFieldConfig<any, GraphQLContext> =
  {
    type: draftUploadFile,
    args: {
      contentType: { type: GraphQLString }
    },
    async resolve(_source, args, ctx) {
      if (!ctx.seller) {
        throw new Error('Unauthorized')
      }
      const draftPrefix = `sellers/${ctx.seller.username}/userImage.draft`
      return await handleDraftUpload(
        draftPrefix,
        args.contentType,
        publicBucket
      )
    }
  }

export default upload_seller_draft_user_image
