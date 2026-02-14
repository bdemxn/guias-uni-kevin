import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient, Role } from '../generated/prisma/client'
import * as bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db"
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash('P@ssw0rd123!', 10)

  const tenantA = await prisma.tenant.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  })

  const tenantB = await prisma.tenant.upsert({
    where: { id: 2 },
    update: {},
    create: {},
  })

  await prisma.user.upsert({
    where: { email: 'admin@tenant-a.com' },
    update: {
      name: 'Admin Tenant A',
      telephone: '+50588880001',
      password: passwordHash,
      role: Role.ADMIN,
      tenantId: tenantA.id,
    },
    create: {
      email: 'admin@tenant-a.com',
      name: 'Admin Tenant A',
      telephone: '+50588880001',
      password: passwordHash,
      role: Role.ADMIN,
      tenantId: tenantA.id,
      profile: { create: {} },
    },
  })

  await prisma.user.upsert({
    where: { email: 'user1@tenant-a.com' },
    update: {
      name: 'User One A',
      telephone: '+50588880002',
      password: passwordHash,
      role: Role.USER,
      tenantId: tenantA.id,
    },
    create: {
      email: 'user1@tenant-a.com',
      name: 'User One A',
      telephone: '+50588880002',
      password: passwordHash,
      role: Role.USER,
      tenantId: tenantA.id,
      profile: { create: {} },
    },
  })

  await prisma.user.upsert({
    where: { email: 'user2@tenant-a.com' },
    update: {
      name: 'User Two A',
      telephone: '+50588880003',
      password: passwordHash,
      role: Role.USER,
      tenantId: tenantA.id,
    },
    create: {
      email: 'user2@tenant-a.com',
      name: 'User Two A',
      telephone: '+50588880003',
      password: passwordHash,
      role: Role.USER,
      tenantId: tenantA.id,
      profile: { create: {} },
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@tenant-b.com' },
    update: {
      name: 'Admin Tenant B',
      telephone: '+50588880004',
      password: passwordHash,
      role: Role.ADMIN,
      tenantId: tenantB.id,
    },
    create: {
      email: 'admin@tenant-b.com',
      name: 'Admin Tenant B',
      telephone: '+50588880004',
      password: passwordHash,
      role: Role.ADMIN,
      tenantId: tenantB.id,
      profile: { create: {} },
    },
  })

  await prisma.user.upsert({
    where: { email: 'user1@tenant-b.com' },
    update: {
      name: 'User One B',
      telephone: '+50588880005',
      password: passwordHash,
      role: Role.USER,
      tenantId: tenantB.id,
    },
    create: {
      email: 'user1@tenant-b.com',
      name: 'User One B',
      telephone: '+50588880005',
      password: passwordHash,
      role: Role.USER,
      tenantId: tenantB.id,
      profile: { create: {} },
    },
  })

  const categories = await Promise.all(
    ['Tech', 'News', 'NestJS', 'Prisma'].map(async (label, idx) => {
      const id = idx + 1
      return prisma.category.upsert({
        where: { id },
        update: {},
        create: {},
      })
    }),
  )

  const post1 = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  })

  const post2 = await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {},
  })

  const post3 = await prisma.post.upsert({
    where: { id: 3 },
    update: {},
    create: {},
  })

  const picks = [
    { postId: post1.id, categoryId: categories[2].id },
    { postId: post1.id, categoryId: categories[3].id },
    { postId: post2.id, categoryId: categories[0].id },
    { postId: post2.id, categoryId: categories[1].id },
    { postId: post3.id, categoryId: categories[0].id },
    { postId: post3.id, categoryId: categories[2].id },
  ]

  for (const pc of picks) {
    await prisma.postCategory.upsert({
      where: { postId_categoryId: { postId: pc.postId, categoryId: pc.categoryId } },
      update: {},
      create: pc,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    throw e
  })
