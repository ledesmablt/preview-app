import type { ExpressContext } from 'apollo-server-express'
import type { Order } from '@prisma/client'

import prisma from '../services/prisma'
import { mustBeLoggedIn } from './utils'
import type { GetOrdersArgs } from './typeDefs'

const resolvers = {
  Query: {
    getOrders: async (
      parent,
      args: GetOrdersArgs,
      context: ExpressContext,
      info
    ): Promise<Order[]> => {
      mustBeLoggedIn(context)
      const take = args.limit ?? 10
      const result = await prisma.order.findMany({
        take,
        skip: take * (args.offset ?? 0)
      })
      return result
    }
  }
}

export default resolvers
