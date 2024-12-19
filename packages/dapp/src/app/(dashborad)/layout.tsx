'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from '@/redux/provider';
import { ApolloWrapper } from '../(main)/apolloWrapper';
import { SessionProvider } from 'next-auth/react';
import Footer from '../components/navigation/footer';
import PrimaryNav from '../components/navigation/PrimaryNav';
import { Web3Provider } from '@/functonality/Web3Provider';
import { ThemeProvider } from '../components/theme-provider';

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
   <html lang="en" suppressHydrationWarning>
      <body className={`flex flex-col justify-between min-h-screen bg-white dark:bg-neutral-900`}>
         <ThemeProvider
            defaultTheme="light"
            storageKey="summitshare-theme"
         >
            <SessionProvider>
               <ApolloWrapper>
                  <Web3Provider>
                     <Providers>
                        <PrimaryNav />
                        <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
                           {children}
                        </div>
                        <Footer />
                     </Providers>
                  </Web3Provider>
               </ApolloWrapper>
            </SessionProvider>
         </ThemeProvider>
      </body>
   </html>
);
}