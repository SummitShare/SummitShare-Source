# SummitShare Design System

This document describes the visual foundations and reusable UI in `packages/dapp`. It is based on the current source code. Guidance for new work is identified explicitly; documented gaps are not implemented fixes.

## 1. Design direction

SummitShare presents African cultural heritage, digital exhibitions, and community participation. The visual language combines warm earth colors, serif titles, clear interface text, and prominent cultural imagery.

For new work:

- Give artifacts, their histories, and communities priority in the composition.
- Use generous space, readable text, and a clear primary action.
- Reserve strong orange accents for emphasis, navigation identity, and selected calls to action.
- Present provenance and cultural context alongside objects. Preserve the distinction between documented history, interpretation, and open questions.
- Keep account, wallet, and transaction instructions direct and specific.

### Visual contexts

| Context | Appearance | Implementation |
| --- | --- | --- |
| Main application | White and pale neutral surfaces, dark text, brown and orange accents | Global CSS, Tailwind utilities, shared components |
| Marketing hero | Full-width imagery, dark overlays, warm highlights, expressive serif title | `heroSection.tsx` |
| `/exhibit` and `/exhibit/[slug]` | Dark brown backgrounds, amber text, Cormorant Garamond titles, pale collection panel on the listing | Exhibit pages and their local font declarations |
| `/record` exhibition | Umber background, cream text, orange accents, mural panels, italic questions | `record.css` and its route layout |
| `/ar` experience | Dark exhibition palette, compact title cards, visible camera controls | `ar.css` and its route layout |

The exhibition and AR treatments are route-specific themes. They are not a global dark-mode toggle; a complete alternate application theme is not defined.

## 2. Source of truth

| Area | Source |
| --- | --- |
| Application color tokens and Tailwind configuration | [packages/dapp/tailwind.config.ts](packages/dapp/tailwind.config.ts) |
| Global typography, navigation styles, article styling | [globals.css](packages/dapp/src/app/styles/globals.css) |
| Exhibition palette, layout, and responsive rules | [record.css](packages/dapp/src/app/record/record.css) |
| Exhibition font loading | [record/layout.tsx](packages/dapp/src/app/record/layout.tsx) |
| AR palette, controls, and motion | [ar.css](packages/dapp/src/app/ar/ar.css) |
| AR font loading | [ar/layout.tsx](packages/dapp/src/app/ar/layout.tsx) |
| Marketing hero | [heroSection.tsx](packages/dapp/src/components/heroSection.tsx) |
| Exhibit listing fonts and layout | [exhibit/page.tsx](<packages/dapp/src/app/(main)/exhibit/page.tsx>) |
| Artifact detail fonts and layout | [exhibit/[slug]/page.tsx](<packages/dapp/src/app/(main)/exhibit/[slug]/page.tsx>) |
| Wallet modal theme | [customTheme.tsx](packages/dapp/src/features/customTheme.tsx) |

Use the dapp's Tailwind configuration for application tokens. The repository-root `tailwind.config.js` does not define the same palette. Read route overrides after global styles when checking the final appearance.

## 3. Color

### Application tokens

These names and values are defined in the dapp Tailwind configuration. Usage descriptions are guidance for new work.

| Token | Value | Use |
| --- | --- | --- |
| `primary-50` | `#F6F3F2` | Warm pale surface |
| `primary-100` | `#746D6A` | Muted text or a stronger neutral border |
| `primary-400` | `#794228` | Brown accent |
| `primary-600` | `#352218` | Deep brown actions |
| `primary-700` | `#352218` | Existing alias of `primary-600` |
| `primary-900` | `#1A0D08` | Headings and high-emphasis text |
| `primary-900-75` | `rgba(26, 13, 8, 0.75)` | Secondary ink |
| `primary-900-5` | `rgba(26, 13, 8, 0.05)` | Subtle borders and fills |
| `re-100` | `#F7DEDE` | Error background |
| `re-500` | `#8B2020` | Error text and border |
| `ge-100` | `#D7F5E2` | Success background |
| `ge-500` | `#207F42` | Success text and border |

Use Tailwind property prefixes: `bg-primary-50`, `text-primary-900`, `border-re-500`. The scale is sparse; `primary-300` and `primary-500` are not defined.

### Other established colors

| Color | Value | Existing use |
| --- | --- | --- |
| White | `#FFFFFF` | Navigation and form surfaces |
| Body ink | `#403B3A` | Global paragraph and article text |
| Neutral 900 | `#171717` | Default shared button and dark marketing sections |
| Orange 400 | `#FB923C` | Exhibition ochre and marketing accents |
| Orange 500 | `#F97316` | “Summit” in the wordmark and hero primary action |
| Orange 600 | `#EA580C` | Marketing accents and article blockquote border |
| Blue 600 | `#2563EB` | Article links |

Orange is a separate accent family from the configured brown `primary-*` tokens. Do not treat the two families as interchangeable.

### Exhibition and AR tokens

The first five entries exist with both `--record-` and `--ar-` prefixes. The remaining entries are declared in AR CSS.

| Token suffix | Value | Role |
| --- | --- | --- |
| `cream` | `#F5EDE0` | Foreground and AR primary-button fill |
| `raised-cream` | `#FFF3E2` | Brighter foreground and hover fill |
| `ochre` | `#FB923C` | Accent and AR focus outline |
| `umber` | `#1B1410` | Main exhibition background |
| `rule` | `rgb(245 237 224 / 0.18)` | Hairline on dark backgrounds |
| `clay` | `#A8482A` | AR palette accent |
| `deep-umber` | `#0F0C09` | Deeper AR ground |
| `ink` | `#101317` | Dark AR surface tone |
| `teal` | `#1F4F4F` | AR palette accent |
| `blue` | `#2E4257` | AR palette accent |
| `body` | `#403B3A` | AR palette body ink |
| `dark-rule` | `rgb(27 20 16 / 0.16)` | Divider on light surfaces |

Preserve the exhibition's section-specific text colors and background overlays. Transparent text must be assessed against the actual surface beneath it.

## 4. Typography

### Font roles

| Role | Family and implementation |
| --- | --- |
| Global headings `h1`–`h5` | Martel, serif; weight `700` |
| Global paragraphs, links, and list items | `system-ui, 'Inter', sans-serif`; system UI is the first choice |
| Shared button | Explicit `system-ui` |
| Wordmark | Martel, `24px`, weight `700`, line height `1.25` |
| Marketing hero title | Cormorant Garamond through `next/font` |
| Marketing hero wrapper | Manrope through `next/font`; element-level font rules can override inheritance |
| `/exhibit` and `/exhibit/[slug]` display | Cormorant Garamond; loaded weights `400`, `600`, `700`; `display.className` applied directly to page and section headings |
| `/exhibit` and `/exhibit/[slug]` body declaration | Manrope; loaded weights `400`, `500`, `600`; `body.className` applied to the page wrapper |
| `/record` display | Martel `700`, `--record-font-display`; page title, section titles, and curatorial labels |
| `/record` body declaration | Manrope `400`, `--record-font-body`, applied to `body` |
| `/record` and `/ar` questions | Cormorant Garamond `500` italic, `--record-font-question` |
| AR interface body | `system-ui, 'Inter', sans-serif` |

Global `p`, `a`, and `li` rules explicitly set their own font family, so they do not automatically inherit Manrope from a wrapper or body. Check computed styles before describing a whole route as Manrope.

Both exhibit pages load their fonts locally through `next/font/google`, with the Latin subset and `display: 'swap'`. The record layout loads its three families with the same subset and loading behavior, exposing CSS variables instead of applying generated family classes to individual headings. Loaded weights describe available font files; the element's CSS still determines its displayed weight. Exhibit headings without another weight utility retain the global `700` weight.

### Global type scale

Pixel equivalents assume a `16px` root font size.

| Style | Size | Weight | Line height |
| --- | --- | --- | --- |
| `h1` | `2rem` / `32px` | `700` | `1.25` |
| `h2` | `1.75rem` / `28px` | `700` | `1.25` |
| `h3` | `1.25rem` / `20px` | `700` | `1.25` |
| `h4` | `1.125rem` / `18px` | `700` | `1.25` |
| `h5` | `0.875rem` / `14px` | `700` | `1.25` |
| `.p1-r`, `.p1-m` | `1rem` / `16px` | `400`, `500` | `1.5` on paragraphs |
| `.p2-r`, `.p2-m` | `0.875rem` / `14px` | `400`, `500` | `1.5` on paragraphs |
| `.p3-r`, `.p3-m` | `0.75rem` / `12px` | `400`, `500` | `1.5` on paragraphs |
| `.l1-r`, `.l1-m` | `1rem` / `16px` | `400`, `600` | `1.25` |
| `.l2-r`, `.l2-m` | `0.875rem` / `14px` | `400`, `600` | `1.25` |
| `.l3-r`, `.l3-m` | `0.75rem` / `12px` | `400`, `600` | `1.25` |

Paragraph utility classes set size and weight only. Use `p1-m`, not `text-p1-m`; the latter is not a configured Tailwind font-size token.

### Editorial scale

- Exhibit listing title: `36px`, increasing to `60px` at `md`; Cormorant Garamond, line height `1.25`.
- Exhibit collection heading: `30px`, increasing to `36px` at `md`; Cormorant Garamond.
- Artifact detail title (`/exhibit/[slug]`): `30px`, `36px` at `sm`, `48px` at `md`; Cormorant Garamond. Detail section headings use `20px`.
- Record introduction: `clamp(32px, 5vw, 52px)`, line height `1.12`, up to `22ch` wide.
- Record section title: `clamp(25px, 3.2vw, 38px)`, line height `1.2`.
- Record body copy: `16px`, line height `1.68`, up to `66ch` wide.
- Record question: `clamp(24px, 2.6vw, 30px)`, italic, line height `1.34`, up to `34ch` wide.
- AR title: `30px` at widths up to `480px`, `34px` by default, `42px` from `760px`.
- Articles: `.blog-content` uses `16px` text and line height `1.75`; `.blog-content--article` adds a first-paragraph drop cap.

For new pages, use one page-level `h1`, ordered section headings, and sentence case for interface labels. Reserve tracked uppercase text for short editorial labels.

## 5. Spacing, layout, and surfaces

For new shared UI, use the existing Tailwind spacing scale. These are preferred working values, not additional custom tokens.

| Spacing | Utilities | Typical use |
| --- | --- | --- |
| `4px` | `gap-1`, `space-y-1` | Label-to-control spacing |
| `8px` | `gap-2`, `p-2` | Compact groups and table cells |
| `12px` | `gap-3`, `p-3` | Small panels |
| `16px` | `gap-4`, `p-4` | Standard content spacing |
| `24px` | `gap-6`, `p-6` | Card padding and navigation groups |
| `32px` | `gap-8`, `p-8` | Card grids and content groups |
| `48px`–`96px` | `py-12` through `py-24` | Section separation |

Existing marketing sections commonly use approximately `5%` horizontal margins on small screens and `15%` on larger screens. This is a page convention, not the behavior of the shared `Container` component.

### Responsive behavior

The dapp does not override Tailwind's standard breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, and `2xl` 1536px.

- Start shared layouts with a single column. Existing information cards expand to two columns at `md` and three at `lg`.
- The fixed primary navigation is `58px` tall, increasing to `68px` at `lg`. Keep content offsets aligned with it.
- Record has its own breakpoints at 480, 768, 1000, 1024, and 1100px. Its mural gallery scrolls horizontally, with vertically scrollable text inside each panel.
- Record hides decorative hero medallions below `768px` and constrains section content to `1400px`.
- AR uses a `980px` maximum entry frame and a `448px` maximum start card. Its two-column entry layout begins at `760px`.
- Record and AR declare a `320px` minimum body width. Preserve access to content and controls at narrow widths and with enlarged text.

### Shape and elevation

| Treatment | Existing use |
| --- | --- |
| `4px` radius | Legacy `Buttons` and some small controls |
| `6px` / `rounded-md` | Shared `Button`, `TextInput`, AR buttons |
| `8px` / `rounded-lg` | `Container`, shared cards, AR loading/error panels |
| `12px` / `rounded-xl` | Hero statistic panels and product cards |
| Full rounding | Status dots, progress indicators, circular medallions |
| Thin border | Default separation for fields, cards, and navigation |
| Small shadow | Shared card baseline |
| Larger shadow and blur | Floating menus and selected AR overlays |

For new work, keep ordinary application surfaces restrained. Use atmospheric gradients, scrims, and deeper shadows in exhibition or overlay contexts. AR entry and start panels have later CSS overrides that remove their initially declared glass background and shadow.

## 6. Components

### Buttons and links

Prefer [Button.tsx](packages/dapp/src/components/button/Button.tsx) for new shared actions. It exports `Button` and `buttonVariants`, accepts native button attributes, forwards a ref, and merges `className` overrides.

| Variant | Current appearance |
| --- | --- |
| `default` | Neutral 900 fill and border, white text |
| `outline` | Transparent fill, neutral border, dark text |
| `danger` | Red 100 fill, red 500 text and border; solid red on hover |
| `success` | Green 100 fill, green 500 border, `ge-500` text; solid green on hover |
| `white` | White fill, light border, dark text |

| Size | Padding | Text |
| --- | --- | --- |
| `small` | `12px` horizontal, `4px` vertical | `12px` |
| `default` | `16px` horizontal, `8px` vertical | `14px` |
| `medium` | `20px` horizontal, `12px` vertical | `16px` |
| `large` | `24px` horizontal, `16px` vertical | `18px` |

The shared button uses a `200ms` transition and a two-pixel focus ring with a one-pixel offset. It has no built-in loading indicator or disabled visual treatment; callers must provide these when needed.

Use a button for an action and a link for navigation. Style links with `buttonVariants` instead of nesting a button inside a link:

```tsx
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/button/Button';

<Button type="submit" size="medium">Save changes</Button>
<Link href="/exhibit" className={buttonVariants({ variant: 'outline' })}>
  Browse exhibits
</Link>
```

[Butons.tsx](packages/dapp/src/components/button/Butons.tsx) is a separate legacy API with `primary`, `secondary`, `tartary`, and `subTartary` styles and 38/48px heights. Its `active` prop changes styling; `disabled` controls native disabled behavior. Avoid extending both button APIs for the same feature.

### Inputs

Prefer [TextInput.tsx](packages/dapp/src/components/inputs/TextInput.tsx) for standard text fields. It supports `default`, `outline`, `error`, and `success` variants; four padding sizes; labels; and optional left/right icons.

- Supply a unique `id` when using `label`; the component connects `htmlFor` to that ID.
- Use persistent labels, appropriate native `type` and `autoComplete`, and nearby help text.
- Pair error styling with an explanation, `aria-invalid`, and `aria-describedby` as appropriate.
- Interactive trailing controls, such as password visibility, need a keyboard-operable button and an accessible name.

[Inputs.tsx](packages/dapp/src/components/inputs/Inputs.tsx) also contains legacy input, select, textarea, and pill controls. It references missing tokens and has accessibility gaps; do not use it as a complete specification for new controls.

### Cards, alerts, and tables

- [Container.tsx](packages/dapp/src/components/Container.tsx) is a full-width bordered panel with `12px` padding and an `8px` radius. It does not constrain page width.
- [card.tsx](packages/dapp/src/components/ui/card.tsx) provides composable card sections with `24px` header/content padding and a small shadow.
- [alert.tsx](packages/dapp/src/components/ui/alert.tsx) provides a title and description with `role="alert"`. Reserve assertive announcements for messages that require immediate attention.
- [table.tsx](packages/dapp/src/components/ui/table.tsx) provides a horizontally scrollable wrapper, `14px` text, `40px` header height, and `8px` cell padding. Supply meaningful headings and captions where needed.

The card, alert, and table primitives reference semantic colors that are not configured; provide explicit existing color utilities until those tokens are implemented. See section 9.

### Navigation and AR controls

- [PrimaryNav.tsx](packages/dapp/src/components/navigation/PrimaryNav.tsx) owns shared header geometry and the wordmark. The wordmark is a span so it does not compete with the page heading.
- `AppNav` adds account and wallet state; `StaticNav` provides links and a native `details` menu without client-side session dependencies.
- Use plain anchors when following the existing static navigation pattern across separate root layouts.
- AR controls use a `46px` minimum height, `6px` corners, `14px` bold text, and `17px` icons. Primary controls are cream on umber; focus outlines are ochre with a three-pixel offset.

## 7. Imagery and content

Use cultural imagery with specific context and descriptive alternative text when it conveys information. Decorative patterns, overlays, and repeated background illustrations should use empty alternative text or `aria-hidden`.

- Preserve aspect ratios and object details. Use deliberate responsive crops for cover imagery; use `contain` when the full object must remain visible.
- The marketing hero has separate mobile and desktop source images and dark overlays to protect text readability.
- Record artwork lives in [public/record](packages/dapp/public/record), with separate portrait mural crops.
- Record's decorative medallions live in `public/record/medallions`. Keep them separate from scannable print assets in `public/ar/print`.
- AR models live in [public/models](packages/dapp/public/models); tracking targets live in `public/ar/targets`.
- Keep `/record`'s curatorial experience free of an implied scan action. Its decorative medallions are not AR entry controls.

For new interface copy, use concrete actions such as “View exhibit,” “Save changes,” and “Try again.” Explain what happens next during loading, wallet connection, camera access, and transaction confirmation. Preserve curatorial names and wording when changing layouts.

## 8. Motion, accessibility, and interaction

Existing motion includes shared button transitions at `200ms`, navigation drawer transitions at `300ms`, AR control transitions at `160ms`, and AR spinner/pulse animations at `900ms`. Record and AR provide reduced-motion overrides; shared marketing animations do not consistently do so.

For new or updated UI:

- Preserve visible keyboard focus and logical reading and tab order.
- Make important actions available without hover. Give icon-only controls accessible names.
- Use a comfortable touch target; `44px` minimum height is a project target for new primary controls, not a description of every existing button.
- Provide text as well as color for errors, success, selection, and progress.
- Define idle, hover, focus, pressed, disabled, loading, success, and failure behavior when relevant. Prevent duplicate submission during pending actions.
- Keep errors actionable and preserve entered form values after recoverable failures.
- Honor `prefers-reduced-motion` for decorative animation and animated scrolling.
- Keep text readable over images and camera feeds with suitable surfaces or scrims.
- Ensure drawers and dialogs manage focus, support keyboard dismissal, and keep hidden controls out of the tab order. The current drawer needs further work here.

These are implementation expectations, not a claim that all existing screens have passed an accessibility audit.



