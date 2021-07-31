import { Router, Request, Response } from 'express'

import { jwtMiddleWare } from '../services/jwt'

const adminRouter = Router()
adminRouter.use(jwtMiddleWare)

adminRouter.get('/', (req: Request, res: Response) => {
  res.send('You are logged in!')
})

export default adminRouter
