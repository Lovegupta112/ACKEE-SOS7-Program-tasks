import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "@/providers/WalletContextProvider";
import Header from "@/components/Header";
import { AlertProvider } from "@/providers/AlertProvider";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});
 
const space = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Earn with Blog Dapp",
  description: "earn with blog dapp on solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivoBlack.variable} ${space.variable} antialiased`}
      >
        <AlertProvider>
        <WalletContextProvider>
         <Header/>
        {children}
        </WalletContextProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
