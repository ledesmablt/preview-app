import prisma from '$lib/services/prisma'
import type { Seller } from '@prisma/client'

type UpdateBodyToSelect<T> = Partial<Record<keyof T, boolean>>
export function updateBodyToSelect<T>(updateBody: any): UpdateBodyToSelect<T> {
  const select: UpdateBodyToSelect<T> = {}
  for (let key in updateBody) {
    select[key as keyof T] = true
  }
  return select
}

export async function sellerOwnsProduct(
  seller: Seller,
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
