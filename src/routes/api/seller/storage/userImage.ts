import { publicBucket } from '$lib/services/storage'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type {
  SellerStorageImage_Put_Body,
  SellerStorageImage_Put_Endpoint
} from '$lib/types/api'

import { EXPIRES_SECONDS } from '$lib/constants'
import { v4 as uuid } from 'uuid'

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

  const draftId = uuid()
  const draftPrefix = `sellers/${seller.username}/userImage.draft`
  const bucketFilePath = `${draftPrefix}-${draftId}`
  const file = publicBucket.file(bucketFilePath)
  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    contentType,
    expires: new Date().getTime() + EXPIRES_SECONDS * 1000
  })

  // remove other draft files if any
  await publicBucket.deleteFiles({
    prefix: draftPrefix
  })
  return {
    body: { data: { signedUrl, fileUrl: file.publicUrl(), draftId } }
  }
}
