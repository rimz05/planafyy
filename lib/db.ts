import { PrismaClient } from "@prisma/client";
//  const prisma = new PrismaClient();
//  export default prisma
declare global{
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;