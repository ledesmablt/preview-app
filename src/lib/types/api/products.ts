import type { JSONBody } from './_common'
import type { Product } from '@prisma/client'

export type Product_Get_Data = Product[]
export type Product_Get_Endpoint = JSONBody<Product_Get_Data>

export type Product_Put_Data = Partial<Product>
export type Product_Put_Endpoint = JSONBody<Product_Put_Data>

export type Product_Post_Endpoint = JSONBody<Partial<Product>>
