import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/redux/provider";

import { ApolloWrapper } from "@/lib/migrations/apolloWrapper";

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
      <body className={`bg-gray-50 mt-24 mx-5 ${inter.className}`}>
        <ApolloWrapper>
          <Providers>{children}</Providers>
        </ApolloWrapper>
      </body>
    </html>
  );
}