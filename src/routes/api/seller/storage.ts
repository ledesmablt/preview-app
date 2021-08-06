import { publicBucket, privateBucket } from '$lib/services/storage'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'

const EXPIRES_SECONDS = 10 * 60

export async function post(req: Request<Locals>): Promise<EndpointOutput> {
  const { seller } = req.locals
  if (!seller) {
    return {
      status: 403
    }
  }
  const body = req.body as any
  const { filePath, isPublic, isPrivate, contentType } = body
  if (!filePath || !(isPublic || isPrivate)) {
    return {
      status: 400,
      body: {
        message: 'Required fields: [filePath, isPublic | isPrivate]'
      }
    }
  }
  const bucket = isPublic ? publicBucket : isPrivate ? privateBucket : null
  if (!bucket) {
    return {
      status: 500,
      body: {
        message: 'Unable to get storage bucket'
      }
    }
  }

  const bucketFilePath = `sellers/${seller.username}/${filePath}`
  const file = bucket.file(bucketFilePath)
  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    contentType: contentType || 'application/octet-stream',
    expires: new Date().getTime() + EXPIRES_SECONDS * 1000
  })
  return {
    body: { signedUrl, bucketFilePath }
  }
}
