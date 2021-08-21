import { GraphQLObjectType } from 'graphql'
import seller_login from './seller_login'
import seller_signup from './seller_signup'
import logout from './logout'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    seller_login,
    seller_signup,
    logout
  }
})
