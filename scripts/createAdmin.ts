import bcrypt from 'bcrypt'
import prisma from '../src/lib/services/prisma'
import { SALT_ROUNDS } from '../src/lib/constants'

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
