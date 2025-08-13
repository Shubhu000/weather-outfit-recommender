import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/store/Providers';

export const metadata: Metadata = {
  title: 'Weather Outfit Recommender',
  description: 'Get weather and outfit suggestions for any city.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="container py-6">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
