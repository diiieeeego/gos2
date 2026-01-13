"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  
  // Lokalni override za 'connecting' jer adapter zna zaglaviti
  const [isManualLoading, setIsManualLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prati promjene stanja i čisti timeout
  useEffect(() => {
    if (connected || !connecting) {
      setIsManualLoading(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [connected, connecting]);

  const handleConnect = () => {
    setIsManualLoading(true);
    setVisible(true);

    // Ako se ništa ne dogodi nakon 8 sekundi, resetiraj gumb
    timeoutRef.current = setTimeout(() => {
      setIsManualLoading(false);
    }, 8000);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } finally {
      window.location.reload(); // Najsigurniji način za čišćenje portova
    }
  };

  // UI odlučuje što prikazati
  const isLoading = (connecting || isManualLoading) && !connected;

  return (
    <nav className="border-b-4 border-[#913f8d] bg-[#121217] p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-10">
        <Link href="/" className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-black uppercase italic text-[#913f8d]">
            GAME OF <span className="text-white">SOL</span>
          </h1>
        </Link>

        <div className="flex gap-4 items-center">
          {isLoading ? (
            <div className="bg-[#2a2a32] border-b-4 border-black px-4 py-2 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#913f8d] animate-spin" />
              <span className="text-[10px] text-neutral-400 font-black">WAIT...</span>
            </div>
          ) : connected && publicKey ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="bg-[#913f8d] border-b-4 border-black px-4 py-2 text-xs font-black text-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                DASHBOARD
              </Link>
              <button onClick={handleDisconnect} className="bg-[#2a2a32] border-b-4 border-black px-4 py-2 text-xs font-black text-neutral-400">
                EXIT
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-[#913f8d] border-b-4 border-black px-4 py-2 text-xs font-black text-neutral-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              CONNECT WALLET
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}