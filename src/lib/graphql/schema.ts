import { GraphQLSchema } from 'graphql'
import query from './query'
import mutation from './mutation'

export const createSchema = async () => {
  // You can substitute this with any way you want to build your schema
  // (that's why this is in an async function -- for libraries like TypeGraphQL)
  return new GraphQLSchema({
    query,
    mutation
  })
}
