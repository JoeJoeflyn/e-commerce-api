import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.admin.create({
    data: {
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
