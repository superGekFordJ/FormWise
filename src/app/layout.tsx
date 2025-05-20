import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FormWise - AI Powered Forms',
  description: 'Create interactive forms from your questionnaires instantly with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            {/* Header is removed from here to allow pages like dashboard to control their own layout fully */}
            {/* <Header /> */}
            <main className="flex-grow"> {/* Removed container, mx-auto, px-4, py-8 */}
              {children}
            </main>
            {/* Footer can be conditional or part of specific page layouts if needed */}
            {/* 
            <footer className="py-6 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} FormWise. All rights reserved.
            </footer>
            */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
