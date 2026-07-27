declare module 'mind-ar/dist/mindar-image-three.prod.js' {
   import type { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

   export interface MindARAnchor {
      group: Group;
      visible: boolean;
      onTargetFound: (() => void) | null;
      onTargetLost: (() => void) | null;
      onTargetUpdate: (() => void) | null;
   }

   export interface MindARThreeOptions {
      container: HTMLElement;
      imageTargetSrc: string;
      maxTrack: number;
      uiLoading?: 'yes' | 'no' | string;
      uiScanning?: 'yes' | 'no' | string;
      uiError?: 'yes' | 'no' | string;
      filterMinCF?: number | null;
      filterBeta?: number | null;
      warmupTolerance?: number | null;
      missTolerance?: number | null;
   }

   export class MindARThree {
      constructor(options: MindARThreeOptions);
      scene: Scene;
      renderer: WebGLRenderer;
      camera: PerspectiveCamera;
      video?: HTMLVideoElement;
      cssRenderer: {
         domElement: HTMLElement;
      };
      start(): Promise<void>;
      stop(): void;
      addAnchor(targetIndex: number): MindARAnchor;
   }
}
