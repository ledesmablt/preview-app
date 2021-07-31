import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express() // You can also use Express

app.use(
  express.json(),
  compression({ threshold: 0 }),
  sirv('static', { dev }),
  sapper.middleware()
)

app.listen(PORT, () => {
  if (dev) {
    console.log(`Server is running on port ${PORT}!`)
  }
})
