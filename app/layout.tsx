import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import { ContextWrapper } from '@/context/index';

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
    <html lang="en">
      <body className={inter.className}>
        <ContextWrapper>
          <Navbar />
          {children}
        </ContextWrapper>
      </body>
    </html>
  );
}
