import prisma from '$lib/services/prisma'
import { publicBucket, privateBucket } from '$lib/services/storage'
import { updateBodyToSelect, sellerOwnsProduct } from '$lib/utils/api'

import type { Bucket } from '@google-cloud/storage'
import type { Request, EndpointOutput, Locals } from '@sveltejs/kit'
import type { Product } from '@prisma/client'
import type {
  Product_Get_Endpoint,
  Product_Post_Endpoint,
  Product_Put_Body,
  Product_Put_Endpoint
} from '$lib/types/api'

type ProductStorageUrls = {
  imageUrl: string | null
  audioPreviewUrl: string | null
  audioProductUrl: string | null
}

async function withStorageUrls(
  product: Product
): Promise<Product & ProductStorageUrls> {
  const displayImage = publicBucket.file(`products/${product.id}/displayImage`)
  const audioPreview = publicBucket.file(`products/${product.id}/audioPreview`)
  const audioProduct = privateBucket.file(`products/${product.id}/audioProduct`)
  const [[imageExists], [previewExists], [productExists]] = await Promise.all([
    displayImage.exists(),
    audioPreview.exists(),
    audioProduct.exists()
  ])
  return {
    ...product,
    imageUrl: imageExists ? displayImage.publicUrl() : null,
    audioPreviewUrl: previewExists ? audioPreview.publicUrl() : null,
    audioProductUrl: productExists ? audioProduct.publicUrl() : null
  }
}

export async function get(
  req: Request<Locals>
): Promise<EndpointOutput<Product_Get_Endpoint>> {
  const productId = req.query.get('id')
  const sellerId = req.query.get('sellerId')
  const isShop = req.query.get('shop')

  if (!productId && !sellerId) {
    return {
      status: 400,
      body: {
        message: 'Missing parameter [id | sellerId]'
      }
    }
  }

  const loggedInSeller = req.locals.seller
  const sellerAuthorized = loggedInSeller?.id === sellerId

  // find multiple
  if (sellerId) {
    try {
      const products = await prisma.product.findMany({
        where: {
          sellerId,
          // only return enabled products if unauthorized or shop
          enabled: !sellerAuthorized || isShop ? true : undefined
        }
      })
      const productsWithStorageUrls = await Promise.all(
        products.map(withStorageUrls)
      )
      return {
        body: {
          data: productsWithStorageUrls
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
    product = await prisma.product.findFirst({
      where: {
        id: productId,
        // hide disabled products if unauthorized
        enabled: !sellerAuthorized ? true : undefined
      },
      rejectOnNotFound: true
    })
  } catch (err) {
    return {
      status: 404
    }
  }
  const productWithImage = await withStorageUrls(product)
  return {
    body: { data: [productWithImage] }
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
    await sellerOwnsProduct(seller, productId)
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
  if (typeof rawUpdateBody.enabled === 'boolean') {
    updateBody.enabled = rawUpdateBody.enabled
  }
  const select = updateBodyToSelect<Product>(updateBody)

  let updatedProduct: Partial<Product> = {}
  if (Object.keys(select).length > 0) {
    try {
      updatedProduct = await prisma.product.update({
        select,
        where: {
          id: productId
        },
        data: updateBody
      })
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

  const replaceIfDraftExists = async (
    storagePath: string,
    bucket: Bucket,
    draftId?: string
  ) => {
    if (!draftId) {
      return
    }
    const draftPrefix = `${storagePath}.draft`
    const draft = bucket.file(`${draftPrefix}-${draftId}`)
    const [exists] = await draft.exists()
    if (exists) {
      await draft.move(storagePath)
    }
  }

  await Promise.all([
    replaceIfDraftExists(
      `products/${productId}/displayImage`,
      publicBucket,
      req.body.imageDraftId
    ),
    replaceIfDraftExists(
      `products/${productId}/audioPreview`,
      publicBucket,
      req.body.audioPreviewDraftId
    ),
    replaceIfDraftExists(
      `products/${productId}/audioProduct`,
      privateBucket,
      req.body.audioProductDraftId
    )
  ])

  return {
    body: {
      data: updatedProduct
    }
  }
}
