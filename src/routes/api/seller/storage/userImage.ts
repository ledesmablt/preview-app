import { publicBucket } from '$lib/services/storage'
import { handleDraftUpload } from '$lib/utils/api'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type {
  SellerStorageImage_Put_Body,
  SellerStorageImage_Put_Endpoint
} from '$lib/types/api'

export async function put(
  req: Request<Locals, SellerStorageImage_Put_Body>
): Promise<EndpointOutput<SellerStorageImage_Put_Endpoint>> {
  const { seller } = req.locals
  if (!seller) {
    return {
      status: 403
    }
  }
  const body = req.body as any
  const { contentType } = body
  if (!contentType) {
    return {
      status: 400,
      body: {
        message: 'Required fields: [contentType]'
      }
    }
  }

  const draftPrefix = `sellers/${seller.username}/userImage.draft`
  const data = await handleDraftUpload(draftPrefix, contentType, publicBucket)
  return {
    body: { data }
  }
}
