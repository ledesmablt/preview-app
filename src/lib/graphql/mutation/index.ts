import { GraphQLObjectType } from 'graphql'
import seller_login from './seller_login'
import seller_signup from './seller_signup'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    seller_login,
    seller_signup
  }
})
