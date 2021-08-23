import prisma from '$lib/services/prisma'
import { v4 as uuid } from 'uuid'
import type { Seller } from '@prisma/client'
import type { Bucket } from '@google-cloud/storage'
import { EXPIRES_SECONDS } from '$lib/constants'

export async function sellerOwnsProduct(
  seller: Partial<Nullable<Seller>>,
  productId: string
): Promise<void> {
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    },
    rejectOnNotFound: true
  })
  if (product.sellerId !== seller.id) {
    throw new Error('Product does not exist under your seller account.')
  }
}

type DraftUpload = {
  signedUrl: string
  fileUrl: string
  draftId: string
}
export async function handleDraftUpload(
  draftPrefix: string,
  contentType: string,
  bucket: Bucket
): Promise<DraftUpload> {
  const draftId = uuid()
  const bucketFilePath = `${draftPrefix}-${draftId}`
  const file = bucket.file(bucketFilePath)
  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    contentType,
    expires: new Date().getTime() + EXPIRES_SECONDS * 1000
  })

  // remove other draft files if any
  await bucket.deleteFiles({
    prefix: draftPrefix
  })
  return {
    signedUrl,
    fileUrl: file.publicUrl(),
    draftId
  }
}
