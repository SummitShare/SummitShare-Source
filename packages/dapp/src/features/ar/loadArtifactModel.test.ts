import { Group, Mesh, MeshBasicMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { applyArtifactModelOpacity } from './loadArtifactModel';

describe('applyArtifactModelOpacity', () => {
   it('uses temporary fade state and restores every original material value', () => {
      const root = new Group();
      const material = new MeshBasicMaterial({ opacity: 0.6 });
      material.transparent = false;
      material.depthWrite = true;
      root.add(new Mesh(undefined, material));

      applyArtifactModelOpacity(root, 0.5);
      expect(material.transparent).toBe(true);
      expect(material.depthWrite).toBe(false);
      expect(material.opacity).toBeCloseTo(0.3);

      applyArtifactModelOpacity(root, 1);
      expect(material.transparent).toBe(false);
      expect(material.depthWrite).toBe(true);
      expect(material.opacity).toBe(0.6);
   });

   it('preserves originally transparent and depth-write-disabled materials', () => {
      const root = new Group();
      const material = new MeshBasicMaterial({
         opacity: 0.4,
         transparent: true,
         depthWrite: false,
      });
      root.add(new Mesh(undefined, material));

      applyArtifactModelOpacity(root, 0);
      applyArtifactModelOpacity(root, 1);

      expect(material.transparent).toBe(true);
      expect(material.depthWrite).toBe(false);
      expect(material.opacity).toBe(0.4);
   });
});
