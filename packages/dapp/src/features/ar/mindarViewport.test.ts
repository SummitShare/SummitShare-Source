import { afterEach, describe, expect, it, vi } from 'vitest';
import { attachMindARViewport } from './mindarViewport';

// Deterministic event/RAF ownership checks, not a browser layout simulation.
const environment = () => {
   const frames = new Map<number, FrameRequestCallback>();
   let frameId = 0;
   const viewport = new EventTarget();
   const windowTarget = Object.assign(new EventTarget(), {
      visualViewport: viewport,
      requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
         frames.set(++frameId, callback);
         return frameId;
      }),
      cancelAnimationFrame: vi.fn((id: number) => frames.delete(id)),
   });
   const observe = vi.fn(),
      disconnect = vi.fn();
   let notifyContainer = () => {};
   vi.stubGlobal('window', windowTarget);
   vi.stubGlobal(
      'ResizeObserver',
      class {
         constructor(callback: ResizeObserverCallback) {
            notifyContainer = () =>
               callback([], this as unknown as ResizeObserver);
         }
         observe = observe;
         disconnect = disconnect;
      }
   );
   return {
      windowTarget,
      viewport,
      frames,
      observe,
      disconnect,
      notifyContainer: () => notifyContainer(),
      flush: () => {
         const pending = [...frames.values()];
         frames.clear();
         pending.forEach((callback) => callback(0));
      },
   };
};
const video = (width = 0, height = 0) =>
   Object.assign(new EventTarget(), {
      videoWidth: width,
      videoHeight: height,
      style: { maxWidth: '100%' },
   }) as HTMLVideoElement;

afterEach(() => vi.unstubAllGlobals());

describe('MindAR viewport ownership', () => {
   it('replaces the patched listener, waits for dimensions and coalesces resize routes', () => {
      const env = environment();
      const originalHandler = vi.fn(),
         resize = vi.fn();
      env.windowTarget.addEventListener('resize', originalHandler);
      const mindAR: Parameters<typeof attachMindARViewport>[0] = {
         container: {} as HTMLElement,
         resize,
         _resizeHandler: originalHandler,
      };
      const dispose = attachMindARViewport(mindAR);
      expect(env.observe).toHaveBeenCalledWith(mindAR.container);
      env.windowTarget.dispatchEvent(new Event('resize'));
      expect(originalHandler).not.toHaveBeenCalled();
      expect(env.frames.size).toBe(0);
      mindAR.controller = {};
      mindAR.video = video();
      mindAR.resize();
      expect(env.frames.size).toBe(0);
      expect(mindAR.video.style.maxWidth).toBe('none');
      Object.assign(mindAR.video, { videoWidth: 480, videoHeight: 640 });
      mindAR.video.dispatchEvent(new Event('loadedmetadata'));
      env.notifyContainer();
      env.viewport.dispatchEvent(new Event('resize'));
      env.viewport.dispatchEvent(new Event('scroll'));
      env.windowTarget.dispatchEvent(new Event('resize'));
      expect(env.frames.size).toBe(1);
      env.flush();
      expect(resize).toHaveBeenCalledOnce();
      expect(resize.mock.contexts[0]).toBe(mindAR);
      mindAR.resize();
      expect(env.frames.size).toBe(1);
      dispose();
      dispose();
      env.notifyContainer();
      env.viewport.dispatchEvent(new Event('resize'));
      env.windowTarget.dispatchEvent(new Event('resize'));
      mindAR.video.dispatchEvent(new Event('resize'));
      mindAR.resize();
      env.flush();
      expect(resize).toHaveBeenCalledOnce();
      expect(env.disconnect).toHaveBeenCalledOnce();
      expect(env.windowTarget.cancelAnimationFrame).toHaveBeenCalledOnce();
      expect(env.frames.size).toBe(0);
   });

   it('rechecks readiness at RAF time and follows a replacement video', () => {
      const env = environment();
      const first = video(480, 640),
         second = video();
      const resize = vi.fn();
      const mindAR: Parameters<typeof attachMindARViewport>[0] = {
         container: {} as HTMLElement,
         controller: {},
         video: first,
         resize,
      };
      const dispose = attachMindARViewport(mindAR);
      expect(env.frames.size).toBe(1);
      mindAR.video = second;
      env.flush();
      expect(resize).not.toHaveBeenCalled();
      Object.assign(second, { videoWidth: 640, videoHeight: 480 });
      first.dispatchEvent(new Event('resize'));
      expect(env.frames.size).toBe(0);
      second.dispatchEvent(new Event('resize'));
      env.flush();
      expect(resize).toHaveBeenCalledOnce();
      mindAR.resize();
      mindAR.controller = undefined;
      env.flush();
      expect(resize).toHaveBeenCalledOnce();
      dispose();
   });
});
