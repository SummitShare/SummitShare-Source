'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { Web3Provider } from '@/features/Web3Provider';
import { ApolloWrapper } from '../(main)/apolloWrapper';

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

                           <div className="">{children} </div>

                     </Web3Provider>
                  </ApolloWrapper>
               </SessionProvider>
            </metadata>
         </body>
      </html>
   );
}
