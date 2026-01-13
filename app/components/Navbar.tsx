"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
// Uvezi Loader2 za spinner
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const primaryPurple = "#913f8d";
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  
  // Dodajemo state koji prati je li se wallet inicijalno učitao
  const [isInitializing, setIsInitializing] = useState(true);

  // Isključujemo inicijalni loading nakon što adapter javi status
  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, [connecting]);

  useEffect(() => {
    const syncUser = async () => {
      if (connected && publicKey) {
        try {
          await fetch('/api/user/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              walletAddress: publicKey.toBase58() 
            }),
          });
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };
    syncUser();
  }, [connected, publicKey]);

  return (
    <>
      <nav className="border-b-4 border-[#913f8d] bg-[#121217] p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-4">
              <Image
                alt="Game of Sol Logo"
                src="/logo.png"
                width={24}
                height={24}
              />
              <h1
                className="text-xl md:text-2xl font-black tracking-tighter uppercase italic"
                style={{ color: primaryPurple }}
              >
                GAME OF <span className="text-white">SOL</span>
              </h1>
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            {/* 1. LOADING STANJE */}
            {(isInitializing || connecting) ? (
              <div className="bg-[#2a2a32] border-b-4 border-black px-4 py-2 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#913f8d] animate-spin" />
                <span className="text-[10px] text-neutral-400 font-black uppercase">Syncing...</span>
              </div>
            ) : connected ? (
              /* 2. CONNECTED STANJE */
              <div className="flex items-center gap-3">
                <Link 
                  href="/dashboard"
                  className="bg-[#913f8d] border-b-4 border-black px-4 py-2 text-xs uppercase font-black active:border-b-0 active:translate-y-1 text-neutral-50 cursor-pointer hover:bg-[#913f8d]/80 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => disconnect()}
                  className="bg-[#2a2a32] border-b-4 border-black px-4 py-2 text-xs uppercase font-black active:border-b-0 active:translate-y-1 text-neutral-400 cursor-pointer hover:bg-[#32323a] transition"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              /* 3. DISCONNECTED STANJE */
              <button 
                onClick={() => setVisible(true)}
                className="bg-[#913f8d] border-b-4 border-black px-4 py-2 text-xs uppercase font-black active:border-b-0 active:translate-y-1 text-neutral-50 cursor-pointer hover:bg-[#913f8d]/80 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}