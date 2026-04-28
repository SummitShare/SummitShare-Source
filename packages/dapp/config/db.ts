import { NextResponse } from 'next/server';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

export const disabledResponse = () =>
   NextResponse.json(
      { message: 'Database temporarily disabled.' },
      { status: 503 }
   );

const adapter = new PrismaLibSql({
   url: process.env.TURSO_DATABASE_URL!,
   authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
