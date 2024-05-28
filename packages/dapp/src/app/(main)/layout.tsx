'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/redux/provider";



import { ApolloWrapper } from "./apolloWrapper";
import { SessionProvider } from "next-auth/react";
import { NavBar } from "../components/navigation/navBar";
import Footer from "../components/navigation/footer";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import EventEscrowComponent from "@/functonality/eventEscrowComponent";

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
      <body className={`bg-gray-50 mt-10  ${inter.className}`}>
        <SessionProvider>
        <ApolloWrapper>
          <Providers>
            <NavBar />
            {children}
        <EventEscrowComponent userAddress="" provider="" exhibitId="0xe405b9c97656336ab949401bcd41ca3f50114725"/>
            <Footer />
          </Providers>
        </ApolloWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
