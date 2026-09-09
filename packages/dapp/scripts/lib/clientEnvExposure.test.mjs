import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const DAPP_ROOT = path.resolve(
   path.dirname(fileURLToPath(import.meta.url)),
   '../..'
);
const nextConfig = createRequire(import.meta.url)(
   path.join(DAPP_ROOT, 'next.config.js')
);

/**
 * `next.config.js`'s `env` block is a build-time literal substitution into the
 * client bundle, and it requires no NEXT_PUBLIC_ prefix — so it is easy to
 * mistake for server config.
 *
 * Server code never needs it: API routes and server components read the real
 * `process.env`. The safe state is no `env` block at all, with anything the
 * browser genuinely needs named NEXT_PUBLIC_*.
 */
const SECRET_SHAPED =
   /(PRIVATE|SECRET|TOKEN|PASSWORD|PASS|CREDENTIAL|_KEY|^KEY|AUTH|SEED|MNEMONIC|DSN|RPC_URL|DATABASE_URL)/i;

describe('next.config.js does not leak server secrets to the client', () => {
   const exposed = Object.keys(nextConfig.env ?? {});

   it('exposes nothing secret-shaped through the env block', () => {
      expect(exposed.filter((name) => SECRET_SHAPED.test(name))).toEqual([]);
   });

   it('exposes nothing at all without a NEXT_PUBLIC_ prefix', () => {
      expect(exposed.filter((name) => !name.startsWith('NEXT_PUBLIC_'))).toEqual(
         []
      );
   });

   it('matches the shapes it is meant to, so the guard cannot rot', () => {
      for (const name of ['API_PRIVATE_KEY', 'SESSION_SECRET', 'SERVICE_TOKEN']) {
         expect(SECRET_SHAPED.test(name)).toBe(true);
      }
      expect(SECRET_SHAPED.test('NEXT_PUBLIC_HOST')).toBe(false);
   });
});
