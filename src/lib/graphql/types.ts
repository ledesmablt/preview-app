import type { Product, Seller } from '@prisma/client'
import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat
} from 'graphql'
import prisma from '$lib/services/prisma'

export const seller: GraphQLObjectType<Seller> = new GraphQLObjectType({
  name: 'Seller',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    username: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    bio: {
      type: GraphQLString
    },
    products: {
      type: GraphQLList(product),
      async resolve(seller) {
        return await prisma.product.findMany({
          where: { sellerId: seller.id }
        })
      }
    }
  })
})

export const product: GraphQLObjectType<Product> = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    price: {
      type: GraphQLFloat
    },
    currency: {
      type: GraphQLString
    },
    enabled: {
      type: GraphQLBoolean
    },
    sellerId: {
      type: GraphQLID
    },
    seller: {
      type: seller
    }
  })
})
