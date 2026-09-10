/**
 * Exhibition partners, credited under the curatorial statement.
 *
 * The three marks arrive in different shapes and inks — an orange chevron, a
 * two-line black wordmark, and a raster lockup that shipped as black on opaque
 * white. Rendering them as-is puts a white sticker and an invisible wordmark on
 * an umber page, so each is drawn as a mask filled with the exhibition's cream:
 * one ink, and every mark keeps its own artwork. The sources under
 * `public/record/` are the prepared copies, not the originals in `public/`.
 *
 * `height` is per-mark rather than shared, because equal pixel height is not
 * equal optical weight: a wordmark six times wider than it is tall would
 * dominate a row that a compact chevron sits quietly in.
 */
export interface Partner {
   readonly name: string;
   readonly href: string;
   readonly asset: string;
   /** Intrinsic aspect, used to derive width from the height below. */
   readonly aspect: number;
   /** Rendered height in px at the row's base scale. */
   readonly height: number;
}

export const PARTNERS: readonly Partner[] = [
   {
      name: 'Världskulturmuseet',
      href: 'https://www.varldskulturmuseet.se/',
      asset: '/record/partner-varldskulturmuseet.svg',
      aspect: 58.21 / 26.9,
      height: 38,
   },
   {
      name: 'Women’s History Museum of Zambia',
      href: 'https://www.whmzambia.org/',
      asset: '/record/partner-whm.svg',
      aspect: 125 / 60,
      height: 40,
   },
   {
      name: 'Ars Electronica',
      href: 'https://ars.electronica.art/',
      asset: '/record/partner-ars-electronica.png',
      aspect: 532 / 477,
      height: 58,
   },
] as const;
