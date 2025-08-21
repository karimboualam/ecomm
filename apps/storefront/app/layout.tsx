import './globals.css';
import { Inter } from 'next/font/google';
import { ApolloWrapper } from './lib/apollo-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'E-Commerce Platform',
  description: 'Modern scalable e-commerce platform',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}