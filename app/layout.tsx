import type { Metadata } from 'next';
import './globals.css';
import { WagmiProvider } from './providers';

export const metadata: Metadata = {
  title: 'FlappyBase - Play on Base & Farcaster',
  description: 'Flappy Bird on Base & Farcaster Frame',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}
