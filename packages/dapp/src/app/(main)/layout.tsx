import '../styles/globals.css';
import { ApolloWrapper } from './apolloWrapper';
import SessionBoundary from '@/components/navigation/SessionBoundary';
import Footer from '@/components/navigation/footer';
import AppNav from '@/components/navigation/AppNav';
import { Web3Provider } from '@/features/Web3Provider';

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`flex flex-col justify-between min-h-screen `}>
            <SessionBoundary>
               <ApolloWrapper>
                  <Web3Provider>
                     <AppNav />
                     <div className="">{children} </div>
                     <Footer />
                  </Web3Provider>
               </ApolloWrapper>
            </SessionBoundary>
         </body>
      </html>
   );
}
