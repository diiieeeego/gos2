"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  const primaryPurple = "#913f8d";
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  // Logika za spremanje korisnika u MongoDB na VPS-u
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
          console.log("User synced with MongoDB");
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };

    syncUser();
  }, [connected, publicKey]);
  return (
    <>
      {/* HEADER / NAVIGATION */}
      <nav className="border-b-4 border-[#913f8d] bg-[#121217] p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-start md:items-center">
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
          <div className="flex gap-4">
            {connected ? (
          // Gumb koji se vidi kad je Wallet SPOJEN
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
            <Link 
              href="/dashboard"
              className="bg-[#913f8d] border-b-4 border-black px-4 py-2 text-xs uppercase font-black active:border-b-0 active:translate-y-1 text-neutral-50 cursor-pointer hover:bg-[#913f8d]/80 transition"
            >
              Dashboard
            </Link>
            <button 
              onClick={() => disconnect()}
              className="bg-[#2a2a32] border-b-4 border-black px-4 py-2 text-xs uppercase font-black active:border-b-0 active:translate-y-1 text-neutral-400 cursor-pointer hover:bg-[#32323a] transition"
            >
              {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)} (Disconnect)
            </button>
          </div>
        ) : (
          // Tvoj originalni dizajn gumba koji otvara Wallet Modal
          <button 
            onClick={() => setVisible(true)}
            className="bg-[#913f8d] border-b-4 border-black px-4 py-2 text-xs uppercase font-black active:border-b-0 active:translate-y-1 text-neutral-50 cursor-pointer hover:bg-[#913f8d]/80 transition"
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
