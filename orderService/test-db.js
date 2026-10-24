import prisma from "./database.js";

async function testConnection() {
  try {
    await prisma.$connect();

    console.log("✅ PostgreSQL connected successfully through Prisma!");

    const orders = await prisma.order.findMany({
      take: 5,
    });

    console.log("✅ Orders table queried successfully!");
    console.log("Orders:", orders);
  } catch (error) {
    console.error("❌ Database connection or query failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();