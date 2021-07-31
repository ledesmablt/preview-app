import prisma from '../src/api/services/prisma'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../src/api/constants'

async function createAdmin() {
  const email = process.env.EMAIL
  const password = process.env.PASSWORD
  if (!email || !password) {
    console.error('missing email / password!')
    return
  }

  const result = await prisma.admin.create({
    data: {
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS)
    }
  })
  console.log(result)
  await prisma.$disconnect()
}

createAdmin()
