import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
   title: 'AR | SummitShare',
   description: 'View a SummitShare artifact in augmented reality.',
};

export const viewport: Viewport = {
   width: 'device-width',
   initialScale: 1,
   viewportFit: 'cover',
   themeColor: '#0f0c09',
};

export default function ARRootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className="m-0 h-[100dvh] overflow-hidden bg-[#0f0c09]">
            {children}
         </body>
      </html>
   );
}
