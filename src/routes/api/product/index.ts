import prisma from '$lib/services/prisma'

import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type { Product } from '@prisma/client'

export async function get(req: Request): Promise<EndpointOutput> {
  const productId = req.query.get('id')
  if (!productId) {
    return {
      status: 400,
      body: {
        message: 'Missing parameter [id]'
      }
    }
  }
  let product: Product
  try {
    product = await prisma.product.findUnique({
      where: {
        id: productId
      },
      rejectOnNotFound: true
    })
  } catch (err) {
    return {
      status: 404
    }
  }
  return {
    body: { data: { ...product } }
  }
}

export async function post(req: Request<Locals>): Promise<EndpointOutput> {
  // create a draft product
  const { seller } = req.locals
  if (!seller) {
    return {
      status: 403
    }
  }
  try {
    const product = await prisma.product.create({
      data: {
        sellerId: seller.id
      }
    })
    return {
      body: {
        data: product
      }
    }
  } catch (e) {
    console.error(e)
    return {
      status: 500,
      body: { message: e.message }
    }
  }
}

export async function put(req: Request<Locals>): Promise<EndpointOutput> {
  const { seller } = req.locals
  if (!seller) {
    return {
      status: 403
    }
  }
  const { id: productId, ...rawUpdateBody } = req.body as any
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      },
      rejectOnNotFound: true
    })
    if (product.sellerId !== seller.id) {
      throw new Error('Product does not exist under your seller account.')
    }
  } catch (err) {
    return {
      status: 404,
      body: {
        message: err.message
      }
    }
  }

  const updateBody: Partial<Product> = {}
  if (rawUpdateBody.description) {
    updateBody.description = rawUpdateBody.description
  }
  const select: Partial<Record<keyof Product, boolean>> = {}
  for (let key in updateBody) {
    select[key as keyof Product] = true
  }

  try {
    const updatedProduct = await prisma.product.update({
      select,
      where: {
        id: productId
      },
      data: updateBody
    })
    return {
      body: {
        data: updatedProduct
      }
    }
  } catch (err) {
    console.error(err)
    return {
      status: 400,
      body: {
        message: err.message
      }
    }
  }
}
