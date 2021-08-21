import { GraphQLObjectType } from 'graphql'
import update_seller from './update_seller'
import create_product from './create_product'
import update_product from './update_product'
import seller_login from './seller_login'
import seller_signup from './seller_signup'
import logout from './logout'
import upload_seller_draft_user_image from './upload_seller_draft_user_image'
import upload_product_draft_display_image from './upload_product_draft_display_image'
import upload_product_draft_audio_preview from './upload_product_draft_audio_preview'
import upload_product_draft_audio_product from './upload_product_draft_audio_product'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // seller
    update_seller,
    upload_seller_draft_user_image,

    // product
    create_product,
    update_product,
    upload_product_draft_display_image,
    upload_product_draft_audio_preview,
    upload_product_draft_audio_product,

    // auth
    seller_login,
    seller_signup,
    logout
  }
})
