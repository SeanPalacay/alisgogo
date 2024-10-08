// src/app/layout.tsx

import './globals.css';
// import { ThemeProvider } from './context/ThemeContext';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import NavBar from './components/Navbar';
import { Inter as FontSans, Old_Standard_TT as FontSerif } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alis Go',
  description: 'Alis-Go Solana NFTs',
  openGraph: {
    title: 'Alis Go',
    description: 'Discover the amazing world of Alis-Go Solana NFTs.',
    images: [
      {
        url: '',
        width: 800,
        height: 600,
        alt: 'Alis-Go Solana NFTs',
      },
    ],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} theme-transition select-none`}>
        <Providers>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NavBar />
            <main className="content-with-navbar-padding">
              {children}
            </main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
