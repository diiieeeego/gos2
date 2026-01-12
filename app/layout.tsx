import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import CookieModal from "./components/CookieModal";
import Footer from "./components/Footer";
// 1. Importaj SolanaProvider
import SolanaProvider from "./components/SolanaProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Game of Sol | The Legacy of Solana Immortalized',
  description: 'Game of Sol, a digital sticker album on Solana. The Collectibles Movement. Complete the challenges. Trade stickers. Join the movement. Popular creators, personalities, and moments from the Solana ecosystem. Collect legendary Solana moments, creators, and organizations in a retro 8-bit style sticker album. Join the legacy!',
  keywords: 'Solana, NFT, Digital Stickers, Game of Sol, Crypto Collection, GOS Token',
  openGraph: {
    title: 'Game of Sol | The Collectibles',
    description: 'The legacy of Solana, immortalized in retro style.',
    url: 'https://gameofsol.com',
    siteName: 'Game of Sol',
    images: [
      {
        url: 'https://gameofsol.com/logo.png', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game of Sol',
    description: 'Collect Solana history in retro style.',
    images: ['https://gameofsol.com/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="bg-[#121217]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. Omotaj sve s SolanaProvider-om */}
        <SolanaProvider>
          <Navbar />
          {children}
          <Footer />
          <CookieModal />
        </SolanaProvider>
      </body>
    </html>
  );
}