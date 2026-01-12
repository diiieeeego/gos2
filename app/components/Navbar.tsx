"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const primaryPurple = "#913f8d";
    return (
    <>
    {/* HEADER / NAVIGATION */}
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
                  <div className="flex gap-4">
                    <button className="bg-[#913f8d] border-b-4 border-black px-4 py-2 text-xs uppercase font-black active:border-b-0 active:translate-y-1 text-neutral-50 cursor-pointer hover:bg-[#913f8d]/80 transition">
                      Connect Wallet
                    </button>
                  </div>
                </div>
              </nav>
    </>
  );

}