export type LocalFloorPose = Readonly<{
   // Cloned, column-major, rigid transform; metres; no scale or skew.
   matrix: Readonly<Float32Array>;
}>;

export type PlacementRequest = Readonly<{
   pose: LocalFloorPose;
   source: 'hit-test' | 'marker';
   createAnchor: ((pose: LocalFloorPose) => Promise<XRAnchor | undefined>) | null;
   fallback: 'fixed' | 'reject';
}>;

export type Placement =
   | Readonly<{
        kind: 'anchored';
        initialPose: LocalFloorPose;
        space: XRSpace;
        release: () => void;
     }>
   | Readonly<{
        kind: 'fixed';
        pose: LocalFloorPose;
        reason: string;
        release: () => void;
     }>;

const errorMessage = (error: unknown) =>
   error instanceof Error ? `${error.name}: ${error.message}` : String(error);

const fixedPlacement = (pose: LocalFloorPose, reason: string): Placement => ({
   kind: 'fixed',
   pose,
   reason,
   release: () => undefined,
});

export async function commitPlacement(
   request: PlacementRequest
): Promise<Placement> {
   let anchorPromise: Promise<XRAnchor | undefined> | null;

   // Deliberately invoke the injected capability before the first await. A hit-test
   // result's originating XRFrame becomes inactive as soon as this callback returns.
   try {
      anchorPromise = request.createAnchor?.(request.pose) ?? null;
   } catch (error) {
      if (request.fallback === 'reject') throw error;
      return fixedPlacement(
         request.pose,
         `anchor creation threw synchronously (${errorMessage(error)})`
      );
   }

   if (anchorPromise === null) {
      if (request.fallback === 'reject') {
         throw new Error(
            'Anchor creation is unavailable and fixed fallback is rejected.'
         );
      }
      return fixedPlacement(
         request.pose,
         'anchor creation was unavailable for the requested policy'
      );
   }

   try {
      const anchor = await anchorPromise;
      if (anchor === undefined) {
         if (request.fallback === 'reject') {
            throw new Error('Anchor creation returned no anchor.');
         }
         return fixedPlacement(
            request.pose,
            'anchor creation returned no anchor'
         );
      }

      let released = false;
      return {
         kind: 'anchored',
         initialPose: request.pose,
         space: anchor.anchorSpace,
         release: () => {
            if (released) return;
            released = true;
            anchor.delete();
         },
      };
   } catch (error) {
      if (request.fallback === 'reject') throw error;
      return fixedPlacement(
         request.pose,
         `anchor creation failed (${errorMessage(error)})`
      );
   }
}
