
// must run npx prisma db seed --preview-feature to seed the database with the admin role
// npx prisma db seed --preview-feature

const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: "admin@example.com" }, //add target email
    data: { role: "ADMIN" },
  });
  console.log("Admin role assigned to admin@example.com");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
