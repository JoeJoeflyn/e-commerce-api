import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.admin.create({
    data: {
      name: "superadmin",
      email: "thaitainguyen336@gmail.com",
      password: await bcrypt.hash("theeasiestpasswordyouwillneverknow", 10),
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
