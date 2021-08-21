import { GraphQLObjectType } from 'graphql'
import seller_login from './seller_login'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    seller_login
  }
})
