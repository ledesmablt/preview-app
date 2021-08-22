import { GraphQLString, GraphQLFieldConfig, GraphQLBoolean } from 'graphql'
import { product } from '../types'
import prisma from '$lib/services/prisma'
import type { GraphQLContext } from '../server'

const get_product: GraphQLFieldConfig<any, GraphQLContext> = {
  args: {
    id: { type: GraphQLString },
    fromShop: { type: GraphQLBoolean }
  },
  type: product,
  async resolve(_source, args, ctx, info) {
    const operation = info.fieldNodes[0]
    const select: Record<string, true> = { sellerId: true }
    const includeSeller = !!operation!.selectionSet!.selections!.find(
      // @ts-ignore
      (s) => s.name.value === 'seller'
    )
    const product = await prisma.product.findFirst({
      include: {
        seller: includeSeller
      },
      where: {
        id: args.id
      },
      rejectOnNotFound: true
    })
    const authorized = ctx.seller?.id === product.sellerId
    if (!product.enabled && (!authorized || args.fromShop)) {
      // hide disabled products if not authorized
      return null
    }
    return product
  }
}

export default get_product
