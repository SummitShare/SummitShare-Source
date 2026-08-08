import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SECTIONS } from './sections';

const RECORD_ASSETS = path.resolve(__dirname, '../../../public/record');

describe('record sections', () => {
   it('ships the graphics and icons every section references', () => {
      for (const section of SECTIONS) {
         for (const asset of [section.graphics, section.icons]) {
            expect(
               existsSync(path.join(RECORD_ASSETS, asset)),
               `${section.section}: missing ${asset}`
            ).toBe(true);
         }
      }
   });

   it('gives each section a distinct identity', () => {
      const slugs = SECTIONS.map((s) => s.section);
      expect(new Set(slugs).size).toBe(slugs.length);
      const numbers = SECTIONS.map((s) => s.n);
      expect(new Set(numbers).size).toBe(numbers.length);
   });

   it('carries the wall text every panel renders', () => {
      for (const section of SECTIONS) {
         expect(section.name.trim()).not.toBe('');
         expect(section.curatorial.trim()).not.toBe('');
         expect(section.body.length).toBeGreaterThan(0);
         expect(section.closing.length).toBeGreaterThan(0);
         expect(section.question.trim().endsWith('?')).toBe(true);
      }
   });

   /**
    * Paragraphs are keyed by their own text, so a duplicate inside one section
    * would collide and React would drop a paragraph of the exhibition copy.
    */
   it('has no duplicate paragraphs within a section', () => {
      for (const section of SECTIONS) {
         for (const paragraphs of [section.body, section.closing]) {
            expect(new Set(paragraphs).size).toBe(paragraphs.length);
         }
      }
   });

   it('renders the mural artwork the optimiser was run against', () => {
      // Guards a silent re-export of the unoptimised source: the murals were
      // ~200 KB each before SVGO and are ~100 KB after.
      for (const section of SECTIONS) {
         const { size } = statSync(path.join(RECORD_ASSETS, section.graphics));
         expect(
            size,
            `${section.graphics} looks unoptimised at ${(size / 1024).toFixed(
               0
            )} KB`
         ).toBeLessThan(140 * 1024);
      }
   });
});
