import { ApolloServer } from 'apollo-server-lambda'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

export async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (ctx) => ctx
  })
  await server.start()
  return server
}
