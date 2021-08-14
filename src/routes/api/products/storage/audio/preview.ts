import { publicBucket } from '$lib/services/storage'
import { sellerOwnsProduct, handleDraftUpload } from '$lib/utils/api'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type {
  ProductStorageAudioPreview_Put_Body,
  ProductStorageAudioPreview_Put_Endpoint,
  ProductStorageAudioPreview_Delete_Body,
  ProductStorageAudioPreview_Delete_Endpoint
} from '$lib/types/api'

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

  const draftPrefix = `products/${id}/audioPreview.draft`
  const data = await handleDraftUpload(draftPrefix, contentType, publicBucket)
  return {
    body: { data }
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
