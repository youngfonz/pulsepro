const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkData() {
  const clients = await prisma.client.count()
  const projects = await prisma.project.count()
  const tasks = await prisma.task.count()
  
  console.log('Database counts:')
  console.log('  Clients:', clients)
  console.log('  Projects:', projects)
  console.log('  Tasks:', tasks)
  
  if (clients > 0) {
    const firstClient = await prisma.client.findFirst()
    console.log('\nFirst client:', firstClient.name)
  }
  
  await prisma.$disconnect()
}

checkData()
