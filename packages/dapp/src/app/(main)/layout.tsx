'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/redux/provider";



import { ApolloWrapper } from "./apolloWrapper";
import { SessionProvider } from "next-auth/react";
import Footer from "../components/navigation/footer";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import EventEscrowComponent from "@/functonality/eventEscrowComponent";
import PrimaryNav from "../components/navigation/PrimaryNav";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
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
      <body className={``}>
        <SessionProvider>
        <ApolloWrapper>
          <Providers>
            <PrimaryNav />
            <div className="lg:mx-[15%]">
            {children}
            </div>
           
            <Footer />
          </Providers>
        </ApolloWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
