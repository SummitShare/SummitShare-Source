import '../styles/globals.css';
import SessionBoundary from '@/components/navigation/SessionBoundary';

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className=" bg-gradient-to-br from-orange-600 via-orange-500 bg-orange-400 ">
            <SessionBoundary>
               <div className=" fixed bottom-5 left-5 space-y-2 ">
                  <h1 className="text-white">
                     Summit<span className="">share</span>
                  </h1>
                  <p className="text-white/80">
                     A pioneering digital platform dedicated to the repatriation{' '}
                     <br />
                     of African cultural artifacts.
                  </p>
               </div>
               {children}
            </SessionBoundary>
         </body>
      </html>
   );
}
