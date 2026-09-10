import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { DEFAULT_EXIT_LABEL, exitButtonName } from './ArExitMenuButton';

// The icon is aria-hidden, so the accessible name is the whole of what assistive
// tech gets from this button — and on the running scanner it is the only way out
// of the view. Two things have to hold: the name says the control leaves, and it
// quotes the visible label where there is one, or speech input cannot address the
// button by the words it reads (WCAG 2.5.3). Both broke once by renaming the
// visible label alone, which left the name reading "Menu".

describe('exitButtonName', () => {
   it('quotes the label and says what the next press does', () => {
      expect(exitButtonName('End AR', false)).toBe(
         'End AR, press twice to confirm'
      );
      expect(exitButtonName('End AR', true)).toBe(
         'End AR, press again to confirm'
      );
   });

   it('distinguishes armed from unarmed', () => {
      expect(exitButtonName('End AR', true)).not.toBe(
         exitButtonName('End AR', false)
      );
   });

   it('always contains the label it was given', () => {
      for (const label of ['End AR', DEFAULT_EXIT_LABEL, 'Leave']) {
         for (const armed of [true, false]) {
            expect(exitButtonName(label, armed)).toContain(label);
         }
      }
   });

   it('names leaving even with no visible label to quote', () => {
      expect(DEFAULT_EXIT_LABEL.toLowerCase()).toMatch(
         /\b(end|exit|close|leave|back)\b/
      );
   });
});

describe('the button wires that name up', () => {
   const source = readFileSync(
      new URL('./ArExitMenuButton.tsx', import.meta.url),
      'utf8'
   );
   const ast = ts.createSourceFile(
      'ArExitMenuButton.tsx',
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
   );

   const ariaLabels: ts.JsxAttribute[] = [];
   const visit = (node: ts.Node) => {
      if (ts.isJsxAttribute(node) && node.name.getText() === 'aria-label') {
         ariaLabels.push(node);
      }
      ts.forEachChild(node, visit);
   };
   visit(ast);

   it('derives the name rather than writing a second string beside the label', () => {
      expect(ariaLabels).toHaveLength(1);
      const initializer = ariaLabels[0].initializer?.getText() ?? '';
      expect(initializer).toContain('exitButtonName');
      // A literal here is the drift that produced the "Menu" regression.
      expect(initializer).not.toMatch(/'[^']*'|"[^"]*"/);
   });
});
