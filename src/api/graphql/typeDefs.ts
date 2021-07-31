import { gql } from 'apollo-server-express'

export interface ListQueryArgs {
  offset?: number
  limit?: number
}

export interface GetOrdersArgs extends ListQueryArgs {
  ids?: string[]
}

const typeDefs = gql`
  type Order {
    id: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Query {
    getOrders(offset: Int, limit: Int, ids: [String]): [Order]
  }
`

export default typeDefs
