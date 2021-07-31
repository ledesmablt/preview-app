import prisma from './services/prisma'
import { json, Router, Express } from 'express'
import cookieParser from 'cookie-parser'

import { startApolloServer } from './graphql'
import adminRouter from './modules/admin'
import authRouter from './modules/auth'

export async function applyAPIAsMiddleware(app: Express): Promise<Express> {
  // other integrations
  await prisma.$connect()
  const apolloServer = await startApolloServer()
  apolloServer.applyMiddleware({ app })

  // actual API
  const apiRouter = Router()
  apiRouter.use(json())
  apiRouter.use(cookieParser())
  apiRouter.use('/admin', adminRouter)
  apiRouter.use('/auth', authRouter)

  apiRouter.get('/', async (_req, res) => {
    return res.send('OK')
  })

  // TEMP
  apiRouter.get('/list', async (_req, res) => {
    const submissions = await prisma.order.findMany()
    return res.send({ data: submissions })
  })

  app.use('/api', apiRouter)
  return app
}
