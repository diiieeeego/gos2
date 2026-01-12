"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Settings } from "lucide-react";

export default function CookieModal() {
  const [isVisible, setIsVisible] = useState(false);
  const primaryPurple = "#913f8d";

  // Provjera je li korisnik već prihvatio cookie
  useEffect(() => {
    const consent = localStorage.getItem("gos-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500); // Odgoda za bolji UX
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("gos-cookie-consent", "all");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-100 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="max-w-4xl mx-auto bg-[#1f1f23] border-4 border-black shadow-[10px_10px_0px_#000] p-6 md:p-8 relative">
        
        {/* RETRO HEADER TABS */}
        <div className="absolute -top-10 left-0 flex gap-1">
            <div className="bg-[#913f8d] text-white px-4 py-1 text-[10px] font-black uppercase border-t-4 border-l-4 border-r-4 border-black">
                Privacy_Protocol.v2
            </div>
            <div className="bg-[#1a1a24] text-gray-500 px-4 py-1 text-[10px] font-black uppercase border-t-4 border-l-4 border-r-4 border-black hidden md:block">
                Cookies
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* ICON SECTION */}
          <div className="hidden md:flex shrink-0 w-20 h-20 bg-[#0a0a0c] border-4 border-dashed border-[#913f8d] items-center justify-center">
            <ShieldCheck size={40} style={{ color: primaryPurple }} className="animate-pulse" />
          </div>

          {/* TEXT SECTION */}
          <div className="grow">
            <h2 className="text-xl font-black uppercase italic mb-2 tracking-tighter flex items-center gap-2 ">
                <span style={{ color: primaryPurple }}>[!]</span> Data Storage Request
            </h2>
            <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed uppercase font-mono">
              To provide the optimal <span className="text-white italic">8-bit experience</span> on the Solana network, 
              we use cookies to store your session data, wallet preferences, and marketplace filters. 
              By clicking &quot;ACCEPT ALL&quot;, you agree to our digital protocol.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col w-full md:w-auto gap-3">
            <button 
              onClick={acceptAll}
              className="bg-[#913f8d] text-white px-8 py-3 text-xs font-black uppercase border-b-4 border-black hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all"
            >
              Accept All
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="bg-transparent text-gray-500 px-8 py-3 text-[10px] font-black uppercase border-2 border-[#1a1a24] hover:border-white hover:text-white transition-all"
            >
              Essential Only
            </button>
          </div>
        </div>

        {/* SETTINGS LINK */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-[#1a1a24] flex justify-between items-center">
            <div className="flex gap-4">
                <a href="#" className="text-[9px] text-gray-600 hover:text-[#913f8d] uppercase font-bold tracking-widest transition-colors">Privacy Policy</a>
                <a href="#" className="text-[9px] text-gray-600 hover:text-[#913f8d] uppercase font-bold tracking-widest transition-colors">Cookie Terms</a>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-[#913f8d] font-bold">
                <Settings size={12} />
                <span className="uppercase">Configure</span>
            </div>
        </div>
      </div>
    </div>
  );
}