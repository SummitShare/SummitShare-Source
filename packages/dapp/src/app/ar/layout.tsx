import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Martel } from 'next/font/google';
import '../styles/globals.css';
import './ar.css';

// Same two faces, same weights and styles as /record's layout. The AR entry is
// the exhibition's title card on a phone, so it should be set in the
// exhibition's type rather than the app's. Kept as a deliberate duplicate
// because /ar is its own root layout — there is no shared ancestor to hold the
// variables, and next/font dedupes the underlying files anyway.
const display = Martel({
   subsets: ['latin'],
   weight: '700',
   display: 'swap',
   variable: '--record-font-display',
});

const question = Cormorant_Garamond({
   subsets: ['latin'],
   weight: '500',
   style: 'italic',
   display: 'swap',
   variable: '--record-font-question',
});

export const metadata: Metadata = {
   title: 'AR | SummitShare',
   description: 'View a SummitShare artifact in augmented reality.',
};

export const viewport: Viewport = {
   width: 'device-width',
   initialScale: 1,
   viewportFit: 'cover',
   themeColor: '#1b1410',
};

export default function ARRootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${display.variable} ${question.variable} ar-route-body h-[100dvh] overflow-hidden`}
         >
            {children}
         </body>
      </html>
   );
}
