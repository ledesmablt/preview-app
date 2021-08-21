import { GraphQLFieldConfig, GraphQLBoolean } from 'graphql'

const logout: GraphQLFieldConfig<any, any, any> = {
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
