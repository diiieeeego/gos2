"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";

interface Card {
  id: number;
  name: string;
  rarity: "common" | "rare" | "epic";
  image: string;
}

interface PageData {
  title: string;
  mainCard: Card;
  gridCards: Card[];
}

const AlbumPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isInTransition, setIsInTransition] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleOpenAlbum = () => {
    setIsInTransition(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsInTransition(false);
    }, 600); // Trajanje flash animacije
  };

  const albumData: PageData[] = [
    {
      title: "Forest Realm",
      mainCard: { id: 1, name: "Ancient Ent", rarity: "epic", image: "/gosCard.png" },
      gridCards: [
        { id: 2, name: "Leaf Sprite", rarity: "common", image: "/gosCard.png" },
        { id: 3, name: "Wolf", rarity: "common", image: "/gosCard.png" },
        { id: 4, name: "Rare Mushroom", rarity: "rare", image: "/gosCard.png" },
        { id: 5, name: "Spider", rarity: "common", image: "/gosCard.png" },
        { id: 6, name: "Forest Guard", rarity: "rare", image: "/gosCard.png" },
      ],
    },
    {
      title: "Void Abyss",
      mainCard: { id: 7, name: "Shadow King", rarity: "epic", image: "/gosCard.png" },
      gridCards: [
        { id: 8, name: "Ghost", rarity: "common", image: "/gosCard.png" },
        { id: 9, name: "Dark Orb", rarity: "common", image: "/gosCard.png" },
        { id: 10, name: "Void Eye", rarity: "rare", image: "/gosCard.png" },
        { id: 11, name: "Soul Eater", rarity: "common", image: "/gosCard.png" },
        { id: 12, name: "Abyss Mage", rarity: "rare", image: "/gosCard.png" },
      ],
    },
  ];

  const pagesPerView = isMobile ? 1 : 2;
  const totalViews = Math.ceil(albumData.length / pagesPerView);

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black font-mono p-4">
        <div className="border-4 border-red-500 p-8 text-red-500 animate-pulse text-center uppercase">
          [ ACCESS DENIED: PLEASE CONNECT WALLET ]
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-200 p-4 font-mono uppercase overflow-x-hidden relative pb-16 selection:bg-[#913f8d]">
      
      {/* CRT SCANLINE EFFECT OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />

      {/* LIGHTBOX / ZOOM CARD */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-xl bg-black/90 animate-in fade-in zoom-in duration-200"
          onClick={() => setSelectedCard(null)}
        >
          <div className="max-w-[320px] w-full border-8 border-[#913f8d] shadow-[0_0_30px_rgba(145,63,141,0.5)]">
            <CardSlot card={selectedCard} isExpanded />
            <div className="bg-[#913f8d] p-2 text-center text-white text-[10px] font-bold">
              PRESS ANYWHERE TO BACK
            </div>
          </div>
        </div>
      )}

      {!isOpen ? (
        /* --- CLOSED STATE --- */
        <div className={`flex flex-col items-center justify-center min-h-[90vh] transition-all duration-500 ${isInTransition ? 'scale-150 opacity-0' : 'scale-100'}`}>
          <div className="relative mb-12">
            {/* Pulsirajući sjaj iza albuma */}
            <div className="absolute inset-0 bg-[#913f8d]/20 blur-3xl animate-pulse rounded-full" />
            <Image 
              src="/album.png" 
              alt="Closed Album" 
              width={240} 
              height={320} 
              className="relative w-56 h-72 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
              style={{ imageRendering: 'pixelated' }} 
            />
          </div>
          
          <button 
            onClick={handleOpenAlbum}
            className="group relative bg-[#913f8d] border-b-8 border-r-8 border-[#5e295b] hover:border-b-4 hover:border-r-4 hover:translate-x-0.5 hover:translate-y-0.5 active:border-0 active:translate-x-1 active:translate-y-1 px-12 py-5 text-2xl font-black text-white transition-all shadow-2xl"
          >
            <span className="relative z-10">START ALBUM</span>
            <div className="absolute inset-0 border-2 border-white/20" />
          </button>
          
          <p className="mt-8 text-neutral-500 text-[10px] tracking-[0.3em] animate-pulse">
            - SELECT TO BOOT -
          </p>
        </div>
      ) : (
        /* --- OPEN STATE --- */
        <div className="max-w-6xl mx-auto animate-in fade-in zoom-in duration-500">
          
          {/* TOP NAVBAR */}
          <div className="flex justify-between items-center mb-8 border-b-4 border-zinc-800 pb-4">
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-[10px] bg-zinc-800 px-4 py-2 hover:bg-[#913f8d] transition-colors border-2 border-zinc-700 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              &lt; EXIT_ALBUM
            </button>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-[#913f8d]">PG_{currentPage + 1} Total {totalViews}</span>
              <div className="flex gap-3">
                <button 
                  disabled={currentPage === 0} 
                  onClick={() => setCurrentPage(p => p - 1)} 
                  className="bg-zinc-800 p-3 cursor-pointer border-2 border-zinc-600 disabled:opacity-20 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                >
                  ◀
                </button>
                <button 
                  disabled={currentPage >= totalViews - 1} 
                  onClick={() => setCurrentPage(p => p + 1)} 
                  className="bg-zinc-800 p-3  cursor-pointer border-2 border-zinc-600 disabled:opacity-20 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          {/* ALBUM CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-2 bg-[#141417] border-12 border-zinc-800 shadow-[20px_20px_0px_rgba(0,0,0,0.5)] overflow-hidden relative">
            {/* Centralna "šarka" albuma */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-2 bg-black/40 z-10 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]" />

            {[...Array(pagesPerView)].map((_, offset) => {
              const pageIdx = (currentPage * pagesPerView) + offset;
              const page = albumData[pageIdx];
              if (!page) return <div key={`empty-${offset}`} className="hidden md:block bg-[#0c0c0e]" />;

              return (
                <div key={pageIdx} className="p-6 md:p-10 relative">
                  <h2 className="text-center text-[#913f8d] text-xl font-black mb-8 italic tracking-tighter border-b-2 border-zinc-800 pb-2">
                    {page.title}
                  </h2>
                  
                  {/* MAIN CARD SLOT */}
                  <div className="flex justify-center mb-10">
                    <div onClick={() => setSelectedCard(page.mainCard)} className="cursor-pointer group relative">
                        <div className="absolute -inset-2 bg-[#913f8d]/20 blur-lg group-hover:bg-[#913f8d]/40 transition-all" />
                        <CardSlot card={page.mainCard} isMain />
                    </div>
                  </div>

                  {/* GRID SLOTS */}
                  <div className="grid grid-cols-3 gap-3">
                    {page.gridCards.map((card) => (
                      <div key={card.id} onClick={() => setSelectedCard(card)} className="cursor-pointer hover:scale-105 transition-transform active:scale-95">
                        <CardSlot card={card} />
                      </div>
                    ))}
                    {/* Empty slots to fill 3x2 grid if needed */}
                    {[...Array(Math.max(0, 6 - page.gridCards.length - 1))].map((_, i) => (
                      <div key={i} className="aspect-3/4 bg-black/30 border-2 border-zinc-800 border-dashed flex items-center justify-center">
                        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FLASH OVERLAY FOR TRANSITION */}
      {isInTransition && (
        <div className="fixed inset-0 bg-white z-200 animate-out fade-out duration-500 pointer-events-none" />
      )}
    </div>
  );
};

/* --- ENHANCED CARD COMPONENT --- */
const CardSlot = ({ card, isMain = false, isExpanded = false }: { card: Card, isMain?: boolean, isExpanded?: boolean }) => {
  let sizeClasses = isMain ? "w-32 h-44 md:w-40 md:h-56 border-4" : "w-full aspect-[3/4] border-2";
  if (isExpanded) sizeClasses = "w-full aspect-[3/4] border-8";
  
  const rarityConfig = {
    common: { color: "border-zinc-600", glow: "" },
    rare: { color: "border-blue-500", glow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]" },
    epic: { color: "border-[#913f8d]", glow: "shadow-[0_0_20px_rgba(145,63,141,0.6)] animate-pulse" }
  };

  const currentRarity = rarityConfig[card.rarity];

  return (
    <div className={`
      ${sizeClasses} ${currentRarity.color} ${currentRarity.glow}
      relative flex flex-col items-center justify-end overflow-hidden bg-zinc-950
      transition-all duration-300
    `}>
      {/* Background Image s Pixel Effectom */}
      <Image 
        src={card.image}
        alt={card.name}
        fill
        className="object-cover opacity-80"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Dark Overlay for text legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10" />
      
      {/* Card Info */}
      <div className="relative z-20 w-full p-2 bg-black/60 backdrop-blur-sm border-t border-white/10 text-center">
        <p className={`
          font-bold text-white tracking-tighter leading-none
          ${isExpanded ? 'text-xl' : (isMain ? 'text-[10px]' : 'text-[8px]')}
        `}>
          {card.name}
        </p>
        {!isExpanded && (
           <div className={`h-0.5 mt-1 w-full ${card.rarity === 'epic' ? 'bg-[#913f8d]' : 'bg-zinc-700'}`} />
        )}
      </div>

      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-30" />
    </div>
  );
};

export default AlbumPage;