'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { ApolloWrapper } from '../(main)/apolloWrapper';
import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/navigation/footer';
import PrimaryNav from '@/components/navigation/PrimaryNav';
import { Web3Provider } from '@/features/Web3Provider';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
   title: 'SummitShare',
   description:
      'A pioneering digital platform dedicated to the repatriation of African cultural artifacts. ',
   icons: {
      icon: '/favicon.ico',
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={``}>
            <metadata>
               <SessionProvider>
                  <ApolloWrapper>
                     <Web3Provider>

                           <PrimaryNav />
                           <div className="">{children} </div>
                           <Footer />

                     </Web3Provider>
                  </ApolloWrapper>
               </SessionProvider>
            </metadata>
         </body>
      </html>
   );
}
