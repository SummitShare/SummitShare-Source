import '../styles/globals.css';
import SessionBoundary from '@/components/navigation/SessionBoundary';
import AppNav from '@/components/navigation/AppNav';
import { Web3Provider } from '@/features/Web3Provider';

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`flex flex-col lg:justify-between mb-20 mx-10 lg:mx-[15%] `}
         >
            <SessionBoundary>
               <Web3Provider>
                  <AppNav />
                  {children}
               </Web3Provider>
            </SessionBoundary>
         </body>
      </html>
   );
}
