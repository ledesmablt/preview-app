import { GraphQLString, GraphQLFieldConfig } from 'graphql'
import { seller } from '../types'
import prisma from '$lib/services/prisma'

const get_seller: GraphQLFieldConfig<any, any, any> = {
  args: {
    id: { type: GraphQLString },
    username: { type: GraphQLString }
  },
  type: seller,
  async resolve(_source, args, _ctx) {
    return await prisma.seller.findFirst({
      where: {
        AND: [{ username: args.username }, { id: args.id }]
      },
      rejectOnNotFound: true
    })
  }
}

export default get_seller
