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
export default prisma
