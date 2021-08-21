import { GraphQLObjectType } from 'graphql'
import update_seller from './update_seller'
import seller_login from './seller_login'
import seller_signup from './seller_signup'
import logout from './logout'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    update_seller,
    seller_login,
    seller_signup,
    logout
  }
})
