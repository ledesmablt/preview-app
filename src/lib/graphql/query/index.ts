import { GraphQLObjectType } from 'graphql'
import get_seller from './get_seller'

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    get_seller
  }
})
