// singleton prisma client instance to be used across the app
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
export default prisma;
