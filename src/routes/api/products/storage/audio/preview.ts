import { publicBucket } from '$lib/services/storage'
import { sellerOwnsProduct } from '$lib/utils/api'
import { v4 as uuid } from 'uuid'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type {
  ProductStorageAudioPreview_Put_Body,
  ProductStorageAudioPreview_Put_Endpoint,
  ProductStorageAudioPreview_Delete_Body,
  ProductStorageAudioPreview_Delete_Endpoint
} from '$lib/types/api'

import { EXPIRES_SECONDS } from '$lib/constants'

export async function put(
  req: Request<Locals, ProductStorageAudioPreview_Put_Body>
): Promise<EndpointOutput<ProductStorageAudioPreview_Put_Endpoint>> {
  const { seller } = req.locals
  if (!seller) {
    return {
      status: 403
    }
  }
  const { id, contentType } = req.body
  if (!id || !contentType) {
    return {
      status: 400,
      body: {
        message: 'Required fields: [id, contentType]'
      }
    }
  }
  try {
    await sellerOwnsProduct(seller, id)
  } catch (err) {
    return {
      status: 404,
      body: {
        message: err.message
      }
    }
  }

  const draftId = uuid()
  const draftPrefix = `products/${id}/audioPreview.draft`
  const bucketFilePath = `${draftPrefix}-${draftId}`
  const file = publicBucket.file(bucketFilePath)
  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    contentType,
    expires: new Date().getTime() + EXPIRES_SECONDS * 1000
  })
  return {
    body: { data: { signedUrl, fileUrl: file.publicUrl(), draftId } }
  }
}

export async function del(
  req: Request<Locals, ProductStorageAudioPreview_Delete_Body>
): Promise<EndpointOutput<ProductStorageAudioPreview_Delete_Endpoint>> {
  const { seller } = req.locals
  if (!seller) {
    return {
      status: 403
    }
  }
  const { id } = req.body
  if (!id) {
    return {
      status: 400,
      body: {
        message: 'Required fields: [id]'
      }
    }
  }
  try {
    await sellerOwnsProduct(seller, id)
  } catch (err) {
    return {
      status: 404,
      body: {
        message: err.message
      }
    }
  }

  const bucketFilePath = `products/${id}/audioPreview`
  const file = publicBucket.file(bucketFilePath)
  await file.delete()
  return {
    body: { message: 'OK' }
  }
}
