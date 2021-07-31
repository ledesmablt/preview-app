import prisma from './services/prisma'
import type { Express } from 'express'

import { startApolloServer } from './graphql'

export async function applyAPIAsMiddleware(app: Express): Promise<Express> {
  // take care to ensure no conflict with sapper routes

  app.get('/api', async (_req, res) => {
    return res.send('OK')
  })

  app.get('/list', async (_req, res) => {
    const submissions = await prisma.order.findMany()
    return res.send({ data: submissions })
  })

  const apolloServer = await startApolloServer()
  apolloServer.applyMiddleware({ app })

  await prisma.$connect()
  return app
}
