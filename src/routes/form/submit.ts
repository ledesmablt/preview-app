import { Prisma } from '@prisma/client'
import type { Request, Response } from 'express'
import prisma from '../../api/services/prisma'

export async function post(req: Request, res: Response) {
  try {
    const result = await prisma.order.create({
      data: req.body
    })
    return res.send(result)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).send(e.message)
    }
    console.error(e)
  }
}
