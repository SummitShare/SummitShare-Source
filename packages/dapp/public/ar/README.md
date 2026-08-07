# SummitShare vitrine AR print kit

Each artifact uses two separate printed items:

1. **Placard QR** — `print/<slug>-qr.svg`. This only opens `/ar/<slug>` in the phone's native camera app.
2. **Tracking medallion** — `print/<slug>-tracking-marker.png`. This circular, text-free wax-seal image is mounted on the small stand inside the vitrine. The SummitShare page tracks it to lock the artifact into place. The matching runtime file is `targets/<slug>.mind`.

Do not use the QR as the tracking target, and do not place the QR inside the jar.

## Print and placement

-  The intended medallion diameter defaults to **90 mm** (3.54 in). At that setting the full square canvas is **120 × 120 mm**, including the near-white quiet margin. Print at 100% scale on matte heavyweight white stock and do not crop that margin. The SVG records those physical dimensions and the PNG embeds matching print density; the PNG is the reference image used to compile the tracker.
-  Tracking range scales with printed marker size. A **roughly 90 mm medallion is recommended for viewing at about 1 m** under good lighting; use a larger diameter if visitors normally stand farther back. A visually “small” patch will only acquire reliably close up and is likely to disappoint at normal vitrine viewing distance. Always validate the final size with the actual phones, glass and lighting used onsite.
-  Mount the medallion **vertically on the centre stand, facing the visitor**, with the artwork's top kept upright. Keep the print flat and rigid so it cannot curl, rotate or move. The target establishes both pose and physical scale; changing its print diameter changes the apparent artifact size.
-  Print the circular QR SVG at **50 mm diameter or larger** on the separate visitor placard. Keep clear space around the circle. Test every final print with both iPhone Camera and Android Camera before installation.
-  Do not laminate the tracking medallion with glossy film. Keep the jar and phone-side glass clean. Fingerprints, scratches and bright reflections can hide tracking features.
-  Use broad, diffuse side lighting. Avoid a spotlight or window reflected directly over the tracking medallion. If glare crosses most of the medallion from normal visitor positions, move or soften the light rather than tilting the marker.
-  Keep the complete marker visible through the jar from likely viewing angles. A metal rim, plinth lip or model support must not cover it.

The default model heights in `src/features/ar/artifacts.ts` are initial calibration for the vertical 90 mm medallion, not measured conservation dimensions. `displayHeight` controls upright height above the medallion's lower edge, while `rotationY` controls presentation yaw around the medallion's up axis. Adjust them only after testing each model in its real jar.

## Regenerate

From `packages/dapp`:

```bash
AR_BASE_URL=https://museum.example AR_MARKER_DIAMETER_MM=90 pnpm generate:ar
```

`AR_BASE_URL` may include a deployment path and defaults to `http://localhost:3000`. `AR_MARKER_DIAMETER_MM` is the intended circular medallion diameter and defaults to the named `DEFAULT_PRINTED_MEDALLION_DIAMETER_MM` value of 90 in the generator. The script records the chosen diameter in each SVG, embeds the corresponding PNG print density, reports rotational-asymmetry measurements, and regenerates all six marker SVG/PNG pairs, `.mind` targets, error-correction-H QR SVGs, and the local Three.js Draco decoder files. Commit the generated files after changing the base URL, diameter or medallion artwork.

Camera access requires HTTPS on a real phone. Localhost is the browser's development-only secure-context exception.
