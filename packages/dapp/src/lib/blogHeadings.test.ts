import { describe, expect, it } from 'vitest';
import { stripHtmlTags } from './blogHeadings';

describe('stripHtmlTags', () => {
   it('removes tags exposed by nested tag removal', () => {
      const input = '<<scr<script>ipt>alert(1)<</scr<script>ipt>';
      expect(stripHtmlTags(input)).toBe('alert(1)');
   });

   it('removes tags nested beyond the two original stripping passes', () => {
      const input = '<<scr<scr<script>ipt>ipt>Heading<</scr<scr<script>ipt>ipt>';
      expect(stripHtmlTags(input)).toBe('Heading');
   });

   it('handles arbitrary nesting depth', () => {
      const tag = '<'.repeat(100) + 'x' + '>'.repeat(100);
      expect(stripHtmlTags(`${tag}Heading`)).toBe('Heading');
   });

   it.each([
      ['A <em>formatted</em> heading', 'A formatted heading'],
      ['<a href="/blog">Linked</a> <strong>heading</strong>', 'Linked heading'],
      ['Plain text &amp; entities', 'Plain text &amp; entities'],
      ['', ''],
   ])('preserves existing text extraction for %j', (input, expected) => {
      expect(stripHtmlTags(input)).toBe(expected);
   });

   it('removes unmatched markup delimiters', () => {
      expect(stripHtmlTags('Incomplete <tag> and <tag')).toBe(
         'Incomplete  and tag'
      );
   });
});
