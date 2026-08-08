import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope, Martel } from 'next/font/google';
import Footer from '@/components/navigation/footer';
import PrimaryNav from '@/components/navigation/PrimaryNav';
import '../styles/globals.css';
import './record.css';
import SessionBoundary from './SessionBoundary';

const display = Martel({
   subsets: ['latin'],
   weight: '700',
   display: 'swap',
   variable: '--record-font-display',
});

const body = Manrope({
   subsets: ['latin'],
   weight: '400',
   display: 'swap',
   variable: '--record-font-body',
});

const question = Cormorant_Garamond({
   subsets: ['latin'],
   weight: '500',
   style: 'italic',
   display: 'swap',
   variable: '--record-font-question',
});

const title = 'What the Record Forgot / What Would You Ask?';
const description =
   'What the Record Forgot / What Would You Ask? begins with absence. Three empty vitrines mark the place of cultural objects separated from the living systems that once gave them meaning.';

export const metadata: Metadata = {
   title,
   description,
   openGraph: {
      title,
      description,
   },
};

export const viewport: Viewport = {
   width: 'device-width',
   initialScale: 1,
   viewportFit: 'cover',
   themeColor: '#1B1410',
};

export default function RecordRootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${display.variable} ${body.variable} ${question.variable} record-shell`}
         >
            <SessionBoundary>
               <PrimaryNav showWallet={false} />
               <div className="record-site-content">{children}</div>
               <div className="record-site-footer">
                  <Footer />
               </div>
            </SessionBoundary>
         </body>
      </html>
   );
}
