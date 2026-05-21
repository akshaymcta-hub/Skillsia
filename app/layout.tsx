import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Skillsia Academy - Student & Fee CRM',
  description: 'Complete student record management and payment installment tracking CRM for Skillsia Academy.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
