'use client';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Import CSS for Solana wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

// Dynamically import the Airdrop component with SSR disabled
const TokenCreator = dynamic(() => import('@/components/TokenCreator'), { ssr: false });

export default function Home() {
  return (
    <div>
      <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/RXkKhOv8Dzuu2V8gdXF3VlpPl0T1wsVL"}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <TokenCreator />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}
