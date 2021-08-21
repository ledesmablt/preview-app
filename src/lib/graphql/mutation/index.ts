import { GraphQLObjectType } from 'graphql'
import update_seller from './update_seller'
import seller_login from './seller_login'
import seller_signup from './seller_signup'
import logout from './logout'
import upload_seller_draft_user_image from './upload_seller_draft_user_image'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // seller
    update_seller,
    upload_seller_draft_user_image,

    // auth
    seller_login,
    seller_signup,
    logout
  }
})
