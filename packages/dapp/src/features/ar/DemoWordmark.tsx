import Image from 'next/image';

/**
 * Small brand mark for the AR demo, bottom-left.
 *
 * Rendered inside the XR DOM overlay so it stays visible during an immersive
 * session, and over a live camera feed the rest of the time. The drop shadow is
 * not decoration: the mark sits on arbitrary real-world backgrounds, and its
 * lightest element is a pale tan that disappears against a bright wall.
 */
export default function DemoWordmark() {
   return (
      <div
         className="pointer-events-none fixed bottom-0 left-0 z-30 leading-none"
         style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
         }}
         aria-label="SummitShare demo"
      >
         <Image
            src="/summitshare-mark.png"
            alt=""
            width={32}
            height={32}
            priority
            unoptimized
            className="block h-8 w-8"
            style={{ filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.55))' }}
         />
         <span className="mt-1 block text-[10px] font-normal lowercase tracking-[0.22em] !text-amber-50/45">
            demo
         </span>
      </div>
   );
}
