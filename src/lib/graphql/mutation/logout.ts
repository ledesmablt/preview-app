import { GraphQLFieldConfig, GraphQLBoolean } from 'graphql'
import type { GraphQLContext } from '../server'

const logout: GraphQLFieldConfig<any, GraphQLContext> = {
  type: GraphQLBoolean,
  async resolve(_source, _args, ctx) {
    if (!ctx.seller) {
      return false
    }
    ctx.token = 'deleted'
    return true
  }
}

export default logout
