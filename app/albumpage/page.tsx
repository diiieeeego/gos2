"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Tipovi za podatke
interface Card {
  id: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic';
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const albumData: PageData[] = [
    {
      title: "Forest Realm",
      mainCard: { id: 1, name: "Ancient Ent", rarity: 'epic', image: '/gosCard.png' },
      gridCards: [
        { id: 2, name: "Leaf Sprite", rarity: 'common', image: '/gosCard.png' },
        { id: 3, name: "Wolf", rarity: 'common', image: '/gosCard.png' },
        { id: 4, name: "Rare Mushroom", rarity: 'rare', image: '/gosCard.png' },
        { id: 5, name: "Spider", rarity: 'common', image: '/gosCard.png' },
        { id: 6, name: "Forest Guard", rarity: 'rare', image: '/gosCard.png' },
      ]
    },
    {
      title: "Void Abyss",
      mainCard: { id: 7, name: "Shadow King", rarity: 'epic', image: '/gosCard.png' },
      gridCards: [
        { id: 8, name: "Ghost", rarity: 'common', image: '/gosCard.png' },
        { id: 9, name: "Dark Orb", rarity: 'common', image: '/gosCard.png' },
        { id: 10, name: "Void Eye", rarity: 'rare', image: '/gosCard.png' },
        { id: 11, name: "Soul Eater", rarity: 'common', image: '/gosCard.png' },
        { id: 12, name: "Abyss Mage", rarity: 'rare', image: '/gosCard.png' },
      ]
    }
  ];

  const pagesPerView = isMobile ? 1 : 2;
  const totalViews = Math.ceil(albumData.length / pagesPerView);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 font-mono uppercase overflow-x-hidden relative pb-16">
      
      {/* --- OVERLAY ZA ZAMUĆIVANJE (Lightbox) --- */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-md bg-black/80 animate-in fade-in duration-300 w-full"
          onClick={() => setSelectedCard(null)}
        >
          <div className="relative animate-in zoom-in-95 duration-300">
             {/* Povećana kartica */}
             <div className="w-[85vw] max-w-100 aspect-3/4">
                <CardSlot card={selectedCard} isExpanded />
             </div>
             <p className="text-center mt-4 text-[10px] text-white animate-pulse">
                Click anywhere to close
             </p>
          </div>
        </div>
      )}

      {!isOpen ? (
        /* --- ZATVORENI ALBUM --- */
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="relative group cursor-pointer animate-bounce mb-12">
            <Image src="/album.png" alt="Closed Album" width={200} height={300} className="w-48 h-64 object-contain" style={{ imageRendering: 'pixelated' }} />
          </div>
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-primary-purple hover:bg-primary-purple/80 text-white px-10 py-4 text-xl border-4 border-black shadow-[3px_3px_0px_0px_white] hover:shadow-none transition-all cursor-pointer"
          >
            OPEN ALBUM
          </button>
        </div>
      ) : (
        /* --- OTVORENI ALBUM --- */
        <div className={`max-w-6xl mx-auto transition-all duration-500 ${selectedCard ? 'blur-sm scale-95' : ''}`}>
          <div className="flex justify-between items-center mb-6 px-2">
            <button onClick={() => setIsOpen(false)} className="text-[10px] text-zinc-500 hover:text-primary-purple underline">
              &lt; Close
            </button>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-zinc-400">View {currentPage + 1}/{totalViews}</span>
              <div className="flex gap-2">
                <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} className="bg-zinc-800 w-10 h-10 border-2 border-white disabled:opacity-30">◀</button>
                <button disabled={currentPage >= totalViews - 1} onClick={() => setCurrentPage(p => p + 1)} className="bg-zinc-800 w-10 h-10 border-2 border-white disabled:opacity-30">▶</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 bg-zinc-900 border-4 md:border-8 border-zinc-800 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            {[...Array(pagesPerView)].map((_, offset) => {
              const pageIdx = (currentPage * pagesPerView) + offset;
              const page = albumData[pageIdx];
              if (!page) return <div key={`empty-${offset}`} className="hidden md:block bg-zinc-950/20" />;

              return (
                <div key={pageIdx} className={`p-4 md:p-8 bg-zinc-900/50 ${offset === 1 ? 'border-l-4 border-zinc-800' : ''}`}>
                  <h2 className="text-center text-primary-purple text-lg md:text-xl mb-6 border-b-2 border-zinc-800 pb-2 truncate">{page.title}</h2>
                  <div className="flex justify-center mb-8">
                    <div onClick={() => setSelectedCard(page.mainCard)} className="cursor-pointer transition-transform hover:scale-105">
                        <CardSlot card={page.mainCard} isMain />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {page.gridCards.map((card) => (
                      <div key={card.id} onClick={() => setSelectedCard(card)} className="cursor-pointer transition-transform hover:scale-105">
                        <CardSlot card={card} />
                      </div>
                    ))}
                    {[...Array(5 - page.gridCards.length)].map((_, i) => (
                      <div key={i} className="aspect-3/4 bg-black/40 border-2 border-zinc-800 border-dashed" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* --- POMOĆNA KOMPONENTA ZA KARTICU --- */
const CardSlot = ({ card, isMain = false, isExpanded = false }: { card: Card, isMain?: boolean, isExpanded?: boolean }) => {
  // Prilagodba veličine ovisno o kontekstu
  let sizeClasses = isMain ? "w-28 h-40 md:w-32 md:h-44 border-4" : "w-full aspect-[3/4] border-2";
  if (isExpanded) sizeClasses = "w-full h-full border-8";
  
  const rarityColors = {
    common: "border-zinc-700",
    rare: "border-blue-500",
    epic: "border-yellow-500 animate-pulse"
  };

  return (
    <div className={`
      ${sizeClasses} ${rarityColors[card.rarity]} 
      relative flex items-center justify-center overflow-hidden bg-black
      shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
    `}>
      <Image 
        src="/gosCard.png"
        alt="Card Background"
        fill
        className="object-cover opacity-90"
        style={{ imageRendering: 'pixelated' }}
      />
      
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent z-10" />
      
      <span className={`
        relative z-20 text-center p-2 leading-none font-bold text-white
        ${isExpanded ? 'text-2xl mb-4' : (isMain ? 'text-[10px] md:text-xs' : 'text-[7px] md:text-[8px]')}
      `}>
        {card.name}
      </span>

      <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-white/10 z-20 pointer-events-none"></div>
    </div>
  );
};

export default AlbumPage;