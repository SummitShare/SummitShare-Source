import '../styles/globals.css';
import SessionBoundary from '@/components/navigation/SessionBoundary';
import Footer from '@/components/navigation/footer';
import AppNav from '@/components/navigation/AppNav';
import Web3Boundary from '@/features/Web3Boundary';

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`flex flex-col justify-between min-h-screen `}>
            <SessionBoundary>
               <Web3Boundary>
                  <AppNav />
                  <div className="">{children} </div>
                  <Footer />
               </Web3Boundary>
            </SessionBoundary>
         </body>
      </html>
   );
}
