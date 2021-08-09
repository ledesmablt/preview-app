import type { JSONBody } from './_common'
import type { Product } from '@prisma/client'

export type Product_Get_Data_Element = Product & {
  imageUrl: string | null
}
export type Product_Get_Data = Product_Get_Data_Element[]
export type Product_Get_Endpoint = JSONBody<Product_Get_Data>

export type Product_Put_Body = Partial<Product>
export type Product_Put_Endpoint = JSONBody<Product_Put_Body>

export type Product_Post_Endpoint = JSONBody<Partial<Product>>

export type ProductStorageImage_Put_Body = {
  id?: string
  contentType?: string
}
export type ProductStorageImage_Put_Endpoint = JSONBody<{
  signedUrl: string
  bucketFilePath: string
}>

export type ProductStorageImage_Delete_Body = {
  id?: string
}
export type ProductStorageImage_Delete_Endpoint = JSONBody<{}>
