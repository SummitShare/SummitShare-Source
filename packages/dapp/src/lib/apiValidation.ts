import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

export type ValidationResult<T> =
   | { ok: true; data: T }
   | { ok: false; response: NextResponse };

export async function parseJson<T>(
   req: Request,
   schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
   let body: unknown;
   try {
      body = await req.json();
   } catch {
      return {
         ok: false,
         response: NextResponse.json(
            { message: 'Invalid JSON body' },
            { status: 400 }
         ),
      };
   }

   const parsed = schema.safeParse(body);
   if (!parsed.success) {
      return {
         ok: false,
         response: NextResponse.json(
            {
               message: 'Validation failed',
               issues: formatIssues(parsed.error),
            },
            { status: 400 }
         ),
      };
   }

   return { ok: true, data: parsed.data };
}

function formatIssues(error: ZodError) {
   return error.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
   }));
}
