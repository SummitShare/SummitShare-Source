import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SECTIONS } from './sections';

const PUBLIC_DIR = path.resolve(__dirname, '../../../public');
const RECORD_ASSETS = path.join(PUBLIC_DIR, 'record');

const styleSheetUrls = () => {
   const css = readFileSync(path.join(__dirname, 'record.css'), 'utf8');
   return [...css.matchAll(/url\(\s*'([^']+)'\s*\)/g)].map(([, url]) => url);
};

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

/**
 * Both halves of this have already gone wrong once. Renaming the mask artifact
 * to likishi left the stylesheet pointing at a deleted marker — a 404 and a
 * missing medallion, because CSS is not a call site a rename walks past. Then
 * merging the QR into the printed disc changed this page's artwork as a side
 * effect, since it was borrowing the live print markers as decoration.
 */
describe('record stylesheet assets', () => {
   it('references only files that ship', () => {
      const urls = styleSheetUrls();
      expect(urls.length).toBeGreaterThan(0);
      for (const url of urls) {
         expect(
            existsSync(path.join(PUBLIC_DIR, url.replace(/^\//, ''))),
            `record.css references missing asset ${url}`
         ).toBe(true);
      }
   });

   it('keeps its decoration independent of the printed AR markers', () => {
      for (const url of styleSheetUrls()) {
         expect(
            url.startsWith('/ar/'),
            `record.css borrows the live AR asset ${url}; copy it under /record instead`
         ).toBe(false);
      }
   });
});
