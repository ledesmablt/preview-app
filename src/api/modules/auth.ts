import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import type { Admin } from '@prisma/client'

import prisma from '../services/prisma'
import { signToken } from '../services/jwt'

const authRouter = Router()

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  let admin: Admin
  try {
    admin = await prisma.admin.findFirst({
      where: {
        email
      }
    })
    const validPassword = bcrypt.compareSync(password, admin.password)
    if (!validPassword) {
      throw new Error()
    }
  } catch (e) {
    console.error(e)
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  signToken({ userId: admin.id }, undefined, res)
  return res.status(200).json({ message: `logged in as ${email}` })
})

export default authRouter
