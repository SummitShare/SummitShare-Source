'use client';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { ApolloWrapper } from './apolloWrapper';
import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/navigation/footer';
import PrimaryNav from '@/components/navigation/PrimaryNav';
import { Web3Provider } from '@/features/Web3Provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`flex flex-col justify-between min-h-screen `}>
            <SessionProvider>
               <ApolloWrapper>
                  <Web3Provider>
                     <PrimaryNav />
                     <div className="">{children} </div>
                     <Footer />
                  </Web3Provider>
               </ApolloWrapper>
            </SessionProvider>
         </body>
      </html>
   );
}
