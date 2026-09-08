interface MindARThreeLike {
   container: HTMLElement;
   controller?: unknown;
   video?: HTMLVideoElement | null;
   resize: () => void;
}

/*
 * What this module can and cannot guard, all verified against the installed
 * mind-ar 1.2.5 dist rather than assumed:
 *
 * CANNOT: the constructor runs
 *   addEventListener("resize", this.resize.bind(this))   (dist:13583)
 * and `bind` captures the prototype method as a value, before any of our code
 * exists. That listener is unreachable — reassigning `mindAR.resize` cannot
 * touch it, and there is no `_resizeHandler` property to remove (grep the dist:
 * zero occurrences). An earlier workaround in devrig removed `undefined` and
 * silently did nothing; a Node reproduction confirmed both listeners survived.
 *
 * DOES NOT NEED TO: that listener was thought to crash before start(), because
 * resize() dereferences `this.controller`, which start() creates. But resize()
 * opens with `if (!this.video) return` (dist:13670) and the constructor never
 * sets `video` — start() does. So MindAR already guards its own pre-start
 * window, and letting the original listener run during a session is correct
 * behaviour, not a hazard.
 *
 * DOES: the real Android bug. resize() derives the video size, camera FOV and
 * both renderer sizes from `container.clientWidth/clientHeight` and
 * `video.videoWidth/videoHeight`, and MindAR recomputes only on `window`
 * 'resize'. On Android `100dvh` re-resolves as the URL bar retracts without
 * reliably firing that event, and if metadata has not landed then
 * videoWidth/videoHeight are 0, making the aspect NaN and the video height
 * "NaNpx". So: observe the container, listen to visualViewport, refuse to run
 * until the video reports real dimensions, and coalesce to one call per frame.
 */

/** Attach once per MindAR instance, immediately after construction. */
export const attachMindARViewport = (mindAR: MindARThreeLike): (() => void) => {
   const resize = mindAR.resize.bind(mindAR);
   let disposed = false;
   let frame: number | null = null;
   let watchedVideo: HTMLVideoElement | null = null;

   const unwatchVideo = () => {
      watchedVideo?.removeEventListener('loadedmetadata', guardedResize);
      watchedVideo?.removeEventListener('resize', guardedResize);
      watchedVideo = null;
   };

   const ready = () => {
      if (disposed || !mindAR.controller || !mindAR.video) return false;
      const video = mindAR.video;
      if (watchedVideo !== video) {
         unwatchVideo();
         watchedVideo = video;
         video.addEventListener('loadedmetadata', guardedResize, { once: true });
         // Keep observing intrinsic size changes, including recovery if metadata
         // arrived while the dimensions were still zero.
         video.addEventListener('resize', guardedResize);
      }
      return video.videoWidth !== 0 && video.videoHeight !== 0;
   };

   function guardedResize() {
      if (!ready() || frame !== null) return;
      frame = window.requestAnimationFrame(() => {
         frame = null;
         // start/stop and video dimensions can change while a frame is pending.
         if (ready()) resize();
      });
   }

   // resize() dereferences the controller, which is only usable during a
   // session, so every route into it must be guarded. The prototype dispatch
   // above catches the constructor's bound window listener; this catches direct
   // calls on the instance. Our own window listener is belt-and-braces for a
   // frozen prototype, and costs nothing because guardedResize coalesces.
   mindAR.resize = guardedResize;
   window.addEventListener('resize', guardedResize);

   const observer = new ResizeObserver(guardedResize);
   observer.observe(mindAR.container);
   const viewport = window.visualViewport;
   viewport?.addEventListener('resize', guardedResize);
   viewport?.addEventListener('scroll', guardedResize);
   guardedResize();

   return () => {
      if (disposed) return;
      disposed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      window.removeEventListener('resize', guardedResize);
      viewport?.removeEventListener('resize', guardedResize);
      viewport?.removeEventListener('scroll', guardedResize);
      observer.disconnect();
      unwatchVideo();
      // Leave mindAR.resize pointing at the guarded, now-inert version: an
      // in-flight start() may still call it after cleanup.
   };
};
