import { GraphQLBoolean, GraphQLFieldConfig, GraphQLString } from 'graphql'
import prisma from '$lib/services/prisma'
import type { GraphQLContext } from '../server'

const delete_product: GraphQLFieldConfig<any, GraphQLContext, any> = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLString }
  },
  async resolve(_source, args, ctx) {
    if (!ctx.seller) {
      throw new Error('Unauthorized')
    }
    await prisma.product.delete({
      where: {
        id: args.id
      }
    })
    return true
  }
}

export default delete_product
