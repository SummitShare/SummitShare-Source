"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NavBar from "./UserPagecomponents/NavBar";
import { ApolloWrapper } from "./apolloWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`bg-white mx-[10px] lg:mx-[30px] mt-20 md:mx-[20px] ${poppins.className}`}>
        <ApolloWrapper>
          <NavBar />
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
};

export default RootLayout;