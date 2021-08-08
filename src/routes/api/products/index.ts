import prisma from '$lib/services/prisma'
import { updateBodyToSelect } from '$lib/utils/api'

import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type { Product } from '@prisma/client'
import type {
  Product_Get_Endpoint,
  Product_Post_Endpoint,
  Product_Put_Body,
  Product_Put_Endpoint
} from '$lib/types/api'

export async function get(
  req: Request
): Promise<EndpointOutput<Product_Get_Endpoint>> {
  const productId = req.query.get('id')
  const sellerId = req.query.get('sellerId')
  if (!productId && !sellerId) {
    return {
      status: 400,
      body: {
        message: 'Missing parameter [id | sellerId]'
      }
    }
  }

  // find multiple
  if (sellerId) {
    try {
      const products = await prisma.product.findMany({
        where: {
          sellerId
        }
      })
      return {
        body: {
          data: products
        }
      }
    } catch (err) {
      return {
        status: 404
      }
    }
  }

  if (!productId) {
    return {
      status: 400
    }
  }

  // find one
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
    body: { data: [{ ...product }] }
  }
}

export async function post(
  req: Request<Locals>
): Promise<EndpointOutput<Product_Post_Endpoint>> {
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

export async function put(
  req: Request<Locals, Product_Put_Body>
): Promise<EndpointOutput<Product_Put_Endpoint>> {
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

  // TODO: validation for all fields
  const updateBody: Partial<Product> = {}
  if (rawUpdateBody.name) {
    updateBody.name = rawUpdateBody.name
  }
  if (rawUpdateBody.description) {
    updateBody.description = rawUpdateBody.description
  }
  if (rawUpdateBody.price) {
    updateBody.price = rawUpdateBody.price
  }
  if (rawUpdateBody.currency) {
    updateBody.currency = rawUpdateBody.currency
  }
  if (rawUpdateBody.enabled) {
    updateBody.enabled = rawUpdateBody.enabled
  }
  const select = updateBodyToSelect<Product>(updateBody)

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
