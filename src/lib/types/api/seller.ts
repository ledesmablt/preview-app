import type { JSONBody } from './_common'
import type { Seller } from '@prisma/client'

export type Seller_Get_Data = {
  email: string
  username: string
  bio: string
  userImageUrl?: string | null
}
export type Seller_Get_Endpoint = JSONBody<Seller_Get_Data>

export type Seller_Put_Body = Partial<Seller> & {
  userImageDraftId?: string
}
export type Seller_Put_Endpoint = JSONBody<Seller_Put_Body>

export type SellerStorageImage_Put_Body = {
  filePath?: string
  contentType?: string
}

export type SellerStorageImage_Put_Endpoint = JSONBody<{
  signedUrl: string
  fileUrl: string
  draftId: string
}>
