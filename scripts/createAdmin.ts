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

  const existing = await prisma.admin.findFirst({
    where: { email }
  })

  if (existing) {
    console.error(`ERROR: email ${email} already exists!`)
    return
  }

  const result = await prisma.admin.create({
    data: {
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS)
    }
  })
  console.log(result)
}

createAdmin().finally(async () => {
  await prisma.$disconnect()
})
