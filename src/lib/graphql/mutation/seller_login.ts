import bcrypt from 'bcrypt'

import { signToken } from '$lib/services/jwt'
import { GraphQLString, GraphQLFieldConfig } from 'graphql'
import { loginResult } from '../types'
import prisma from '$lib/services/prisma'
import type { Seller } from '@prisma/client'

const seller_login: GraphQLFieldConfig<any, any, any> = {
  args: {
    emailOrUsername: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  type: loginResult,
  async resolve(_source, args, ctx) {
    const { emailOrUsername, password = '' } = args
    let seller: Seller
    seller = await prisma.seller.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          {
            username: emailOrUsername
          }
        ]
      },
      rejectOnNotFound: true
    })
    const validPassword = bcrypt.compareSync(password, seller.password)
    if (!validPassword) {
      throw new Error('Invalid password')
    }
    ctx.seller = seller
    const token = signToken({ userId: seller.id })
    ctx.token = token
    return {
      token,
      seller
    }
  }
}

export default seller_login
