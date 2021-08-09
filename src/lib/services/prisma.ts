import * as Prisma from '@prisma/client'
import PrismaBuild from '@prisma/client'

let PrismaClient: typeof Prisma.PrismaClient

// build time workaround - Vite hates CommonJS
if (process.env.NODE_ENV === 'production') {
  PrismaClient = PrismaBuild.PrismaClient
} else {
  PrismaClient = Prisma.PrismaClient
}

const prisma = new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  // dev timer middleware
  prisma.$use(async (params, next) => {
    const timestamp = new Date().getTime().toString().slice(11)
    const label = `prisma ${timestamp} ${params.action} ${params.model}`
    console.time(label)
    const result = await next(params)
    console.timeEnd(label)
    return result
  })
}

export default prisma
