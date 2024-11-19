import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import { ContextWrapper } from '@/context/index';
import SessionWrapper from '@/components/SessionWrapper';



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolEth",
  description: "Solana and Ethereum wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={inter.className}>
        <SessionWrapper>
          <ContextWrapper>
            <Navbar />
            {children}
          </ContextWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
