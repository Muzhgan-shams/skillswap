/* * singleton prisma client instance to be used across the app*/
import { env } from "../config/env"; // loads and validates env vars before Prisma client initializes
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
export default prisma;
