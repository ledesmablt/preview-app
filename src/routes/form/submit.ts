import { Prisma } from '@prisma/client'
import type { Request, Response } from 'express'
import prisma from '$lib/services/prisma'

export async function post(req: Request, res: Response) {
  try {
    const result = await prisma.order.create({
      data: req.body
    })
    return {
      body: result
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      return {
        status: 400,
        body: {
          message: e.message
        }
      }
    }
  }
}
