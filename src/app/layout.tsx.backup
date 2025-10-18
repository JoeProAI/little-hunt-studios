import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Little Hunt Studios',
  description: 'Professional video generation platform powered by Sora 2 and GPT Image 1',
  keywords: ['Little Hunt Studios', 'Sora 2', 'AI Video', 'Video Generation', 'GPT Image', 'Cinematic'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
