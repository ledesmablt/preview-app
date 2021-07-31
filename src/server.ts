import * as sapper from '@sapper/server'
import compression from 'compression'
import express from 'express'
import sirv from 'sirv'

import { applyAPIAsMiddleware } from './api'
import prisma from './api/services/prisma'

const { NODE_ENV, PORT } = process.env
const dev = NODE_ENV === 'development'

async function init() {
  const app = express()
  app.use(
    express.json(),
    compression({ threshold: 0 }),
    sirv('static', { dev })
  )

  await applyAPIAsMiddleware(app)

  app.use(sapper.middleware())
  app.listen(PORT)
}

init().finally(async () => {
  await prisma.$disconnect()
})
