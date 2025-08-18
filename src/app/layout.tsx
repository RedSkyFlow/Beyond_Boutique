import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Alegreya } from 'next/font/google';
import { GuestProvider } from '@/context/guest-context';

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
});

export const metadata: Metadata = {
  title: 'Boutique CRM',
  description: 'A CRM for boutique hotels.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${alegreya.variable} font-body antialiased`}>
        <GuestProvider>
          {children}
        </GuestProvider>
        <Toaster />
      </body>
    </html>
  );
}
