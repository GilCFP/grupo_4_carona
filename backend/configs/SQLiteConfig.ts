import { prisma } from "../datasources/client.js";

export const SQLiteConfig = {
  connection: prisma
};

export type SQLiteConnection = typeof prisma;
