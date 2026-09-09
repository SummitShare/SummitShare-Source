import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// The icon is aria-hidden and this button is the running AR view's only way out,
// so its accessible name is the whole of what assistive tech gets. Two rules have
// to hold in every state: the name must say the control ends AR, and it must
// contain the visible label verbatim, or speech input cannot address the button
// by the words it reads (WCAG 2.5.3). Both broke once by renaming the label
// alone, which is why this is asserted against the source instead of reviewed.
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

function collect<T extends ts.Node>(
   root: ts.Node,
   guard: (node: ts.Node) => node is T
): T[] {
   const found: T[] = [];
   const visit = (node: ts.Node) => {
      if (guard(node)) found.push(node);
      ts.forEachChild(node, visit);
   };
   visit(root);
   return found;
}

const ariaLabels = collect(
   ast,
   (node): node is ts.JsxAttribute =>
      ts.isJsxAttribute(node) && node.name.getText() === 'aria-label'
);

// The only literal text in the tree: the icon's spans are empty, so whatever is
// left is what a sighted visitor reads on the button.
const visibleText = collect(ast, (node): node is ts.JsxText => ts.isJsxText(node))
   .map((node) => node.getText().trim())
   .filter(Boolean);

describe('AR exit button naming', () => {
   it('carries one aria-label and one fixed visible label', () => {
      expect(
         ariaLabels.length,
         'expected exactly one aria-label on the button'
      ).toBe(1);
      // A visible label built from an expression would vary by state, which both
      // breaks the label-in-name pairing below and resizes the button between the
      // two presses, moving the target out from under the thumb.
      expect(
         visibleText,
         'expected one static visible label, not a per-state expression'
      ).toHaveLength(1);
   });

   it('names ending AR in every state, and quotes the visible label', () => {
      const initializer = ariaLabels[0]?.initializer;
      const states = initializer
         ? collect(initializer, ts.isStringLiteral).map((node) => node.text)
         : [];

      // Armed and unarmed both need covering; one fixed name could not tell
      // anyone that the first press only arms the control.
      expect(
         states.length,
         'expected an accessible name for both the armed and unarmed states'
      ).toBeGreaterThanOrEqual(2);

      for (const name of states) {
         expect(name).toContain(visibleText[0]);
         expect(name.toLowerCase()).toMatch(/\b(end|exit|close|leave)\b/);
      }
   });
});
