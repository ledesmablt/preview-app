import type { JSONBody } from './_common'
import type { Seller } from '@prisma/client'

export type Seller_Get_Data = {
  email: string
  username: string
  bio?: string | null
  userImageUrl?: string | null
}
export type Seller_Get_Endpoint = JSONBody<Seller_Get_Data>

export type Seller_Put_Body = Partial<Seller>
export type Seller_Put_Endpoint = JSONBody<Seller_Put_Body>

export type Seller_Storage_Post_Body = {
  filePath?: string
  isPublic?: boolean
  isPrivate?: boolean
  contentType?: string
}

export type Seller_Storage_Post_Endpoint = JSONBody<{
  signedUrl: string
  bucketFilePath: string
}>
