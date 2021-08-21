import type { Product, Seller } from '@prisma/client'
import type { GraphQLContext as Context } from './server'
import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat
} from 'graphql'
import prisma from '$lib/services/prisma'
import { publicBucket, privateBucket } from '$lib/services/storage'

export const seller: GraphQLObjectType = new GraphQLObjectType<Seller, Context>(
  {
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
        type: GraphQLString,
        resolve(seller, _args, ctx) {
          if (ctx.seller?.id !== seller.id) {
            return null
          }
          return seller.password
        }
      },
      bio: {
        type: GraphQLString
      },
      userImageUrl: {
        type: GraphQLString,
        async resolve(seller) {
          const [[file]] = await publicBucket.getFiles({
            prefix: `sellers/${seller.username}/userImage`
          })
          return file ? file.publicUrl() : null
        }
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
  }
)

export const product: GraphQLObjectType = new GraphQLObjectType<
  Product,
  Context
>({
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
    },
    imageUrl: {
      type: GraphQLString,
      async resolve(product) {
        const [[file]] = await publicBucket.getFiles({
          prefix: `products/${product.id}/displayImage`
        })
        return file ? file.publicUrl() : null
      }
    },
    audioPreviewUrl: {
      type: GraphQLString,
      async resolve(product) {
        const [[file]] = await publicBucket.getFiles({
          prefix: `products/${product.id}/audioPreview`
        })
        return file ? file.publicUrl() : null
      }
    },
    audioProductUrl: {
      type: GraphQLString,
      async resolve(product) {
        const [[file]] = await privateBucket.getFiles({
          prefix: `products/${product.id}/audioProduct`
        })
        return file ? file.publicUrl() : null
      }
    }
  })
})

export const loginResult: GraphQLObjectType = new GraphQLObjectType({
  name: 'LoginResult',
  fields: () => ({
    token: {
      type: GraphQLString
    },
    seller: {
      type: seller
    }
  })
})
