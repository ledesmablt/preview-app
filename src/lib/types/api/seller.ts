import type { JSONBody } from './_common'
import type { Seller } from '@prisma/client'

export type Seller_Get_Data = {
  email: string
  username: string
  bio?: string | null
  userImageUrl?: string | null
}
export type Seller_Get_Endpoint = JSONBody<Seller_Get_Data>

export type Seller_Put_Data = Partial<Seller>
export type Seller_Put_Endpoint = JSONBody<Seller_Put_Data>
