import { publicBucket } from '$lib/services/storage'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type {
  SellerStorageImage_Put_Body,
  SellerStorageImage_Put_Endpoint
} from '$lib/types/api'

import { EXPIRES_SECONDS } from '$lib/constants'

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
  const { filePath, contentType } = body
  if (!filePath || !contentType) {
    return {
      status: 400,
      body: {
        message: 'Required fields: [filePath, contentType]'
      }
    }
  }

  const bucketFilePath = `sellers/${seller.username}/${filePath}`
  const file = publicBucket.file(bucketFilePath)
  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    contentType,
    expires: new Date().getTime() + EXPIRES_SECONDS * 1000
  })
  return {
    body: { data: { signedUrl, bucketFilePath } }
  }
}
