# SummitShare vitrine AR print kit

Each artifact uses two separate printed items:

1. **Placard QR** — `print/<slug>-qr.svg`. This only opens `/ar/<slug>` in the phone's native camera app.
2. **Tracking label** — `print/<slug>-tracking-marker.png`. The SummitShare page tracks this image to lock the artifact into the vitrine. The matching runtime file is `targets/<slug>.mind`.

Do not use the QR as the tracking target, and do not place the QR inside the jar.

## Print and placement

-  Print each tracking-label PNG at exactly **160 × 160 mm** (6.3 × 6.3 in), 100% scale, on matte heavyweight white stock. Do not crop the pale outer quiet margin. The SVG is supplied for inspection or professional prepress, but the PNG is the reference print used to compile the tracker.
-  Place the tracking label **flat and level at the base of the bell jar**, centred under the intended artifact position. Secure all four corners so it cannot curl or move. The label establishes both pose and physical scale; changing its print size changes the apparent artifact size.
-  Print the circular QR SVG at **50 mm diameter or larger** on the separate visitor placard. Keep clear space around the circle. Test every final print with both iPhone Camera and Android Camera before installation.
-  Do not laminate the tracking label with glossy film. Keep the jar and phone-side glass clean. Fingerprints, scratches and bright reflections can hide tracking features.
-  Use broad, diffuse side lighting. Avoid a spotlight or window reflected directly over the tracking label. If glare crosses most of the label from normal visitor positions, move or soften the light rather than tilting the label.
-  Keep the complete marker visible through the jar from likely viewing angles. A metal rim, plinth lip or model support must not cover it.

The default model heights in `src/features/ar/artifacts.ts` assume the 160 mm marker above. They are initial display calibration, not measured conservation dimensions. Adjust `displayHeight` only after testing each model in its real jar.

## Regenerate

From `packages/dapp`:

```bash
AR_BASE_URL=https://museum.example pnpm generate:ar
```

`AR_BASE_URL` may include a deployment path and defaults to `http://localhost:3000`. The script regenerates all six marker SVG/PNG pairs, `.mind` targets, error-correction-H QR SVGs, and the local Three.js Draco decoder files. Commit the generated files after changing the base URL or label artwork.

Camera access requires HTTPS on a real phone. Localhost is the browser's development-only secure-context exception.
