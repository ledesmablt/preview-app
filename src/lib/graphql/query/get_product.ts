import { GraphQLString, GraphQLFieldConfig } from 'graphql'
import { product } from '../types'
import prisma from '$lib/services/prisma'

const get_product: GraphQLFieldConfig<any, any, any> = {
  args: {
    id: { type: GraphQLString },
    username: { type: GraphQLString }
  },
  type: product,
  async resolve(_source, args, _ctx) {
    return await prisma.product.findFirst({
      where: {
        id: args.id
      },
      rejectOnNotFound: true
    })
  }
}

export default get_product
