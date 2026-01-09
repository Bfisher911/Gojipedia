import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'Gojipedia | The Ultimate Godzilla Encyclopedia',
    template: '%s | Gojipedia',
  },
  description:
    'Your encyclopedic guide to Godzilla and the kaiju universe. Explore monsters, movies, timelines, and shop authentic merchandise.',
  keywords: [
    'Godzilla',
    'Gojira',
    'kaiju',
    'monsters',
    'Toho',
    'MonsterVerse',
    'King Ghidorah',
    'Mothra',
    'Rodan',
    'Mechagodzilla',
  ],
  authors: [{ name: 'Gojipedia' }],
  creator: 'Gojipedia',
  publisher: 'Gojipedia',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Gojipedia',
    title: 'Gojipedia | The Ultimate Godzilla Encyclopedia',
    description:
      'Your encyclopedic guide to Godzilla and the kaiju universe. Explore monsters, movies, timelines, and shop authentic merchandise.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gojipedia | The Ultimate Godzilla Encyclopedia',
    description:
      'Your encyclopedic guide to Godzilla and the kaiju universe.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col bg-[#0a0a0f]`}>
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
