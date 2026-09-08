interface MindARThreeLike {
   container: HTMLElement;
   controller?: unknown;
   video?: HTMLVideoElement | null;
   resize: () => void;
   // Only the PATCHED build defines this. See the note below; it is optional
   // precisely because the two repos install mind-ar differently.
   _resizeHandler?: (() => void) | null;
}

/*
 * What this module can and cannot guard, all verified against the installed
 * mind-ar 1.2.5 dist rather than assumed:
 *
 * CANNOT (here), CAN (in production): the constructor runs
 *   addEventListener("resize", this.resize.bind(this))   (dist:13583)
 * and `bind` captures the prototype method as a value, so reassigning
 * `mindAR.resize` cannot reach that listener. Whether it can be REMOVED depends
 * on which repo you are in, and this is a trap worth stating plainly:
 *
 *   - Workbench (`ar-`), npm, UNPATCHED: no `_resizeHandler` property exists
 *     (grep the dist: zero occurrences), so there is nothing to remove and the
 *     old devrig workaround removed `undefined` and did nothing.
 *   - Production (SummitShare), pnpm, PATCHED: `patches/mind-ar@1.2.5.patch`
 *     adds `this._resizeHandler = this.resize.bind(this)` in the constructor
 *     and removes it in stop(). There the listener IS removable; this helper
 *     detaches it and installs the guarded replacement below.
 *
 * Verifying one repo's node_modules tells you nothing about the other's.
 *
 * PARTLY MITIGATED: the unguarded listener was thought to crash before start(),
 * because resize() dereferences `this.controller`, which start() creates. But
 * resize() opens with `if (!this.video) return` (dist:13670) and the
 * constructor never sets `video` — start() does. So MindAR already guards its
 * own pre-start window, and letting the original run during a session is
 * correct behaviour rather than a hazard.
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
         // MindAR's cover-sized video must not inherit responsive-media max-width.
         video.style.maxWidth = 'none';
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
   // session, so every route into it must be guarded.
   //
   // Route 1, the constructor's own window listener. Reachable ONLY in the
   // patched production build, which stores the bound reference so it can be
   // removed; the unpatched workbench copy leaves `_resizeHandler` undefined
   // and this is a no-op there. Take ownership of the property afterwards so
   // MindAR's patched stop() removes our guarded listener rather than a stale
   // one it can no longer reach.
   if (mindAR._resizeHandler) {
      window.removeEventListener('resize', mindAR._resizeHandler);
   }
   mindAR._resizeHandler = guardedResize;

   // Route 2, direct calls on the instance.
   mindAR.resize = guardedResize;

   // Route 3, our own listener. In the patched build this is the only one left.
   // In the unpatched workbench the original also survives, which is harmless:
   // during a session an unguarded resize is simply correct behaviour, and
   // before start() MindAR's own `if (!this.video) return` covers it.
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
