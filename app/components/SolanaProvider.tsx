'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// ISPRAVLJENO: Koristi standardni import umjesto require()
import '@solana/wallet-adapter-react-ui/styles.css';

export default function SolanaProvider({ children }: { children: React.ReactNode }) {
  // Postavi na 'mainnet-beta' za produkciju ili 'devnet' za testiranje
  const network = WalletAdapterNetwork.Mainnet; 
  
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // 'wallets' polje može ostati prazno jer moderni Solana novčanici 
  // koriste "Wallet Standard" koji adapter automatski prepoznaje.
  const wallets = useMemo(() => [], []); 

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}