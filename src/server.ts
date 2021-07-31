import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'

import { startApolloServer } from './graphql'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

async function init() {
  const app = express()
  app.use(
    express.json(),
    compression({ threshold: 0 }),
    sirv('static', { dev })
  )

  app.get('/api', (_req, res) => {
    res.send('OK')
  })

  const apolloServer = await startApolloServer()
  apolloServer.applyMiddleware({ app })

  app.use(sapper.middleware()) // always goes last
  app.listen(PORT)
}

init()
