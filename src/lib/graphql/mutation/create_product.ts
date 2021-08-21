import type { GraphQLFieldConfig } from 'graphql'
import { product } from '../types'
import prisma from '$lib/services/prisma'
import type { GraphQLContext } from '../server'

const create_product: GraphQLFieldConfig<any, GraphQLContext, any> = {
  type: product,
  async resolve(_source, _args, ctx) {
    if (!ctx.seller) {
      throw new Error('Unauthorized')
    }
    return await prisma.product.create({
      data: {
        sellerId: ctx.seller.id as string
      }
    })
  }
}

export default create_product
