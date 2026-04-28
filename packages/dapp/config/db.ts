import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

export const PRISMA_DISABLED = false;

export const disabledResponse = () =>
   NextResponse.json({ message: 'Database temporarily disabled.' }, { status: 503 });

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

export default prisma;
