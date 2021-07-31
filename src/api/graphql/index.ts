import { ApolloServer } from 'apollo-server-express'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

export async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })
  await server.start()
  return server
}