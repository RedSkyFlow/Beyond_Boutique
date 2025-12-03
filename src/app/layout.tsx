import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Alegreya } from 'next/font/google';
import { GuestProvider } from '@/context/guest-context';
import { AuthProvider } from '@/context/auth-context';

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
});

export const metadata: Metadata = {
  title: 'Beyond Boutique',
  description: 'CRM for exceptional hospitality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${alegreya.variable} font-body antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <GuestProvider>
            {children}
          </GuestProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
