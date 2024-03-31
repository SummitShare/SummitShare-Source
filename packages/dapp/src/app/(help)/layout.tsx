import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/redux/provider";
import Navbar from "../components/common/nav/navbar/navbar";
import Footer from "../components/common/nav/footer/footer";
import MenuButton from "../components/common/nav/helpMenu/helpMenu";

import HelpNav from "../components/common/nav/helpMenu/helpMenuDestop";
import { ApolloWrapper } from "@/app/(main)/apolloWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SummitShare",
  description:
    "A pioneering digital platform dedicated to the repatriation of African cultural artifacts. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-white gray-50 mt-24 mx-5 ${inter.className}`}>
        <ApolloWrapper>
          <Providers>
            <Navbar />

            <HelpNav />
            <div className="w-full space-y-12 lg:w-[60%] lg:ml-[35%]">
              <div className="space-y-6">
                <MenuButton />
              </div>
              {children}
            </div>

            <Footer />
          </Providers>
        </ApolloWrapper>
      </body>
    </html>
  );
}
