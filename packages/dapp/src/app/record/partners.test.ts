import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { PARTNERS } from './partners';

// These marks are drawn as CSS masks, which fail silently: a missing file or a
// viewBox that no longer matches the artwork renders an empty box, no error,
// and a partner quietly vanishes from their own credit. Both have happened —
// the Världskulturmuseet viewBox was left sized for a stray element after it
// was removed, so 69% of its box was empty and it pushed the row off centre.

const PUBLIC = path.join(process.cwd(), 'public');

function intrinsicAspect(asset: string): number {
   const file = path.join(PUBLIC, asset);
   const bytes = readFileSync(file);

   if (asset.endsWith('.svg')) {
      const viewBox = /viewBox="([^"]+)"/.exec(bytes.toString('utf8'))?.[1];
      if (!viewBox) throw new Error(`${asset} has no viewBox`);
      const [, , w, h] = viewBox
         .trim()
         .split(/[\s,]+/)
         .map(Number);
      return w / h;
   }

   // PNG: IHDR width/height are the two 32-bit ints after the chunk header.
   expect(bytes.subarray(1, 4).toString('latin1')).toBe('PNG');
   return bytes.readUInt32BE(16) / bytes.readUInt32BE(20);
}

describe('exhibition partners', () => {
   it('lists every partner exactly once', () => {
      expect(new Set(PARTNERS.map((p) => p.href)).size).toBe(PARTNERS.length);
      expect(PARTNERS.length).toBeGreaterThan(0);
   });

   it.each(PARTNERS.map((p) => [p.name, p] as const))(
      '%s: asset exists and its declared aspect matches the artwork',
      (_name, partner) => {
         expect(() =>
            readFileSync(path.join(PUBLIC, partner.asset))
         ).not.toThrow();

         // 2% covers rounding in the declared ratio, not a wrong viewBox: the
         // bug this guards against was off by a factor of three.
         const actual = intrinsicAspect(partner.asset);
         expect(partner.aspect).toBeGreaterThan(actual * 0.98);
         expect(partner.aspect).toBeLessThan(actual * 1.02);
      }
   );

   it.each(PARTNERS.map((p) => [p.name, p] as const))(
      '%s: links out over https',
      (_name, partner) => {
         const url = new URL(partner.href);
         expect(url.protocol).toBe('https:');
         expect(partner.name.trim()).not.toBe('');
      }
   );
});
