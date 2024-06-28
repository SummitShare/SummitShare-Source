'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from '@/redux/provider';
import { ApolloWrapper } from './apolloWrapper';
import { SessionProvider } from 'next-auth/react';
import Footer from '../components/navigation/footer';
import PrimaryNav from '../components/navigation/PrimaryNav';
import { ThirdwebProvider } from '@thirdweb-dev/react';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'SummitShare',
  description:
    'A pioneering digital platform dedicated to the repatriation of African cultural artifacts. ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <SessionProvider>
          <ApolloWrapper>
            <ThirdwebProvider>
              <Providers>
                <PrimaryNav />
                <div className="lg:mx-[15%]">{children}</div>
                <Footer />
              </Providers>
            </ThirdwebProvider>
          </ApolloWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
