import { GraphQLObjectType } from 'graphql'
import get_seller from './get_seller'
import get_product from './get_product'

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    get_seller,
    get_product
  }
})
