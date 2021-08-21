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
          const prefix = `sellers/${seller.username}/userImage`
          const file = publicBucket.file(prefix)
          return (await file.exists()) ? file.publicUrl() : null
        }
      },
      products: {
        type: GraphQLList(product),
        args: {
          fromShop: { type: GraphQLBoolean }
        },
        async resolve(seller, args, ctx) {
          let enabled: boolean | undefined = true
          const authorized = ctx.seller?.id === seller.id
          if (authorized && !args.fromShop) {
            // show disabled products only if authorized
            enabled = undefined
          }
          return await prisma.product.findMany({
            where: { sellerId: seller.id, enabled }
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
        const prefix = `products/${product.id}/displayImage`
        const file = publicBucket.file(prefix)
        return (await file.exists()) ? file.publicUrl() : null
      }
    },
    audioPreviewUrl: {
      type: GraphQLString,
      async resolve(product) {
        const prefix = `products/${product.id}/audioPreview`
        const file = publicBucket.file(prefix)
        return (await file.exists()) ? file.publicUrl() : null
      }
    },
    audioProductUrl: {
      type: GraphQLString,
      async resolve(product) {
        const prefix = `products/${product.id}/audioProduct`
        const file = privateBucket.file(prefix)
        return (await file.exists()) ? file.publicUrl() : null
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

export const draftUploadFile = new GraphQLObjectType({
  name: 'DraftUploadFile',
  fields: {
    signedUrl: { type: GraphQLString },
    fileUrl: { type: GraphQLString },
    draftId: { type: GraphQLString }
  }
})
