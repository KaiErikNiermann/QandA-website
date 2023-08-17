import { PrismaClient } from "@prisma/client";
import { env } from "$env/dynamic/private";

declare global {
    var prisma: PrismaClient; 
}

const prisma = new PrismaClient();

if (env.NODE_ENV === "development") {
    globalThis.prisma = prisma;
}

export { prisma };
