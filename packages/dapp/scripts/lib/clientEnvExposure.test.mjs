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
 * CLIENT bundle. It is not a server-config mechanism and it does not require a
 * NEXT_PUBLIC_ prefix, which makes it an easy place to expose a secret without
 * noticing.
 *
 * It already happened: `DEV_PRIVATE_KEY` was listed there and its value was
 * emitted verbatim into the JS chunk that loads on /escrow, because
 * `contractInit.ts` imports `walletInit.ts` for addresses and ABIs and so pulls
 * the `process.env.DEV_PRIVATE_KEY` reference into the client graph.
 *
 * Server code never needs this block — API routes and server components read
 * the real `process.env`. So the safe state is no `env` block at all, and
 * anything genuinely needed in the browser is named NEXT_PUBLIC_* and is not a
 * secret.
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

   it('still recognises the name that leaked, so this guard cannot rot', () => {
      expect(SECRET_SHAPED.test('DEV_PRIVATE_KEY')).toBe(true);
      expect(SECRET_SHAPED.test('RPC_URL')).toBe(true);
      expect(SECRET_SHAPED.test('NEXT_PUBLIC_HOST')).toBe(false);
   });
});
