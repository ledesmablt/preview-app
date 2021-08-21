import bcrypt from 'bcrypt'

import { signToken } from '$lib/services/jwt'
import { GraphQLString, GraphQLFieldConfig } from 'graphql'
import { validate } from '$lib/utils/validation/signup'
import { loginResult } from '../types'
import { SALT_ROUNDS } from '$lib/constants'
import prisma from '$lib/services/prisma'
import type { Seller } from '@prisma/client'

const seller_signup: GraphQLFieldConfig<any, any, any> = {
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    confirmPassword: { type: GraphQLString }
  },
  type: loginResult,
  async resolve(_source, args, ctx) {
    const { errors: validationErrors } = validate(args)
    if (validationErrors) {
      throw new Error(JSON.stringify(validationErrors))
    }

    const { username, email, password: rawPassword } = args
    let seller: Seller | null
    let existingSeller = await prisma.seller.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })
    if (existingSeller) {
      throw new Error(
        `Account already exists for ${
          existingSeller.email === email
            ? `email ${email}`
            : `username ${username}`
        }`
      )
    }

    const password = await bcrypt.hash(rawPassword, SALT_ROUNDS)
    seller = await prisma.seller.create({
      data: {
        username,
        email,
        password
      }
    })
    ctx.seller = seller
    const token = signToken({ userId: seller.id })
    ctx.token = token
    return {
      token,
      seller
    }
  }
}

export default seller_signup
