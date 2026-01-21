"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import albumDataRaw from "./album.json";

// Točna definicija kartice prema tvom JSON-u
interface AlbumCard {
  idc: number;
  name: string;
  img: string;
}

// Sučelje za stavke u Table of Contents (opcionalno ako želiš kasnije koristiti)
interface TOCItem {
  name: string;
  page: number;
  pagesm: number;
}

// Glavno sučelje za sekcije albuma
interface AlbumSection {
  id: number;
  title: string;
  description: string;
  content: string;
  cards: AlbumCard[];
  items?: TOCItem[]; // Za Table of Contents objekt
}

const AlbumPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCard, setSelectedCard] = useState<AlbumCard | null>(null);
  const [isInTransition, setIsInTransition] = useState(false);
  /* const { connected } = useWallet(); */

  // Sigurno kastanje i filtriranje podataka
  const rawData = albumDataRaw as unknown as AlbumSection[];
  const albumData: AlbumSection[] = rawData.filter((item) => item.id !== 1);

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
    }, 600);
  };

  const pagesPerView = isMobile ? 1 : 2;
  const totalViews = Math.ceil(albumData.length / pagesPerView);

  const nextPage = () => {
    if (currentPage < totalViews - 1) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
  };

  /* if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black font-mono p-4">
        <div className="border-4 border-red-500 p-8 text-red-500 animate-pulse text-center uppercase">
          [ ACCESS DENIED: PLEASE CONNECT WALLET ]
        </div>
      </div>
    );
  } */

  const defaultCard: AlbumCard = {
    idc: 0,
    name: "LOCKED",
    img: "/card.webp", // Pazi da imaš ovu sliku u public folderu
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-200 p-4 font-mono uppercase overflow-x-hidden relative pb-16 selection:bg-[#913f8d]">
      {/* CRT SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />

      {/* LIGHTBOX / ZOOM CARD */}
      {selectedCard && (
        <div
          className="fixed inset-3 z-100 flex items-center justify-center p-4 backdrop-blur-xl bg-black/90 animate-in fade-in zoom-in duration-200"
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
        <div
          className={`flex flex-col items-center justify-center min-h-[90vh] transition-all duration-500 ${
            isInTransition ? "scale-150 opacity-0" : "scale-100"
          }`}
        >
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-[#913f8d]/20 blur-3xl animate-pulse rounded-full" />
            <Image
              src="/album.png"
              alt="Closed Album"
              width={240}
              height={320}
              className="relative w-56 h-72 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              style={{ imageRendering: "smooth" }}
            />
          </div>

          <button
            onClick={handleOpenAlbum}
            className="group relative cursor-pointer bg-[#913f8d] border-b-8 border-r-8 border-[#5e295b] hover:border-b-4 hover:border-r-4 hover:translate-x-0.5 hover:translate-y-0.5 active:border-0 active:translate-x-1 active:translate-y-1 px-12 py-5 text-2xl font-black text-white transition-all shadow-2xl"
          >
            <span className="relative z-10">START ALBUM</span>
            <div className="absolute inset-0 border-2 border-white/20" />
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto animate-in fade-in zoom-in duration-500">
          <div className="flex justify-between items-center mb-8 border-b-4 border-zinc-800 pb-4 px-2">
            <button
              onClick={() => setIsOpen(false)}
              className="text-[10px] bg-zinc-800 px-4 py-2 hover:bg-[#913f8d] transition-colors border-2 border-zinc-700 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              &lt; EXIT_ALBUM
            </button>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-[#913f8d] hidden sm:inline">
                VIEW_{currentPage + 1} / {totalViews}
              </span>
              <div className="flex gap-3">
                <button
                  disabled={currentPage === 0}
                  onClick={prevPage}
                  className="bg-zinc-800 p-3 cursor-pointer border-2 border-zinc-600 disabled:opacity-20 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                >
                  ◀
                </button>
                <button
                  disabled={currentPage >= totalViews - 1}
                  onClick={nextPage}
                  className="bg-zinc-800 p-3 cursor-pointer border-2 border-zinc-600 disabled:opacity-20 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 bg-[#141417] border-4 md:border-12 border-zinc-800 shadow-[20px_20px_0px_rgba(0,0,0,0.5)] overflow-hidden relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-black/40 z-10 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]" />

            {[...Array(pagesPerView)].map((_, offset) => {
              const pageIdx = currentPage * pagesPerView + offset;
              const section = albumData[pageIdx];

              if (!section)
                return (
                  <div
                    key={`empty-${offset}`}
                    className="hidden md:block bg-[#0c0c0e]"
                  />
                );

              const mainCard = section.cards[0];
              const gridCards = section.cards.slice(1);

              return (
                <div
                  key={section.id + "-" + offset}
                  className="p-6 md:p-10 relative min-h-150 border-zinc-900 border-b md:border-b-0"
                >
                  <div className="mb-6">
                    <h2 className="text-center text-[#913f8d] text-xl font-black italic tracking-tighter">
                      {section.title}
                    </h2>
                    <p className="text-[9px] text-zinc-500 text-center mt-1 normal-case tracking-widest">
                      {section.description}
                    </p>
                    <div className="h-0.5 w-1/2 bg-zinc-800 mx-auto mt-4" />
                  </div>

                  <div className="flex justify-center mb-8">
                    {mainCard ? (
                      <div
                        onClick={() => setSelectedCard(mainCard)}
                        className="cursor-pointer group relative"
                      >
                        <div className="absolute -inset-2 bg-[#913f8d]/10 blur-lg group-hover:bg-[#913f8d]/30 transition-all" />
                        <CardSlot card={mainCard} isMain />
                      </div>
                    ) : (
                      <div
                        onClick={() => setSelectedCard(defaultCard)}
                        className="cursor-pointer opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                      >
                        <div className="absolute -inset-2 bg-[#913f8d]/10 blur-lg group-hover:bg-[#913f8d]/30 transition-all" />
                        <CardSlot card={defaultCard} isMain />
                      </div>
                      
                    )}
                  </div>

                  {/* GRID SLOTS (3x2 format - uvijek 5 slotova jer je 1 main iznad) */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* 1. Renderiramo postojeće kartice iz JSON-a (ali ne više od 5) */}
                    {gridCards.slice(0, 5).map((card, idx) => (
                      <div
                        key={card.idc + "-" + idx}
                        onClick={() => setSelectedCard(card)}
                        className="cursor-pointer hover:scale-105 transition-transform active:scale-95"
                      >
                        <CardSlot card={card} />
                      </div>
                    ))}

                    {/* 2. Popunjavamo preostala mjesta do broja 5 sa defaultCard */}
                    {[...Array(Math.max(0, 5 - gridCards.length))].map(
                      (_, i) => (
                        <div
                          key={`empty-slot-${i}`}
                          className="opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help"
                          onClick={() => setSelectedCard(defaultCard)}
                        >
                          <CardSlot card={defaultCard} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isInTransition && (
        <div className="fixed inset-0 bg-[#913f8d]/10 z-200 animate-out fade-out duration-100 pointer-events-none" />
      )}
    </div>
  );
};

const CardSlot = ({
  card,
  isMain = false,
  isExpanded = false,
}: {
  card: AlbumCard;
  isMain?: boolean;
  isExpanded?: boolean;
}) => {
  let sizeClasses = isMain
    ? "w-36 h-48 md:w-44 md:h-60"
    : "w-full aspect-[3/4]";
  if (isExpanded) sizeClasses = "w-full aspect-[3/4]";

  return (
    <div
      className={`
      ${sizeClasses} 
      relative flex flex-col items-center justify-end overflow-hidden 
      transition-all duration-300 group
    `}
    >
      <div className="absolute inset-3">
        <Image
          src={card.img.replace("./", "/")}
          alt={card.name}
          fill
          className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          style={{ imageRendering: "smooth" }}
          
        />
      </div>

      <div className="absolute inset-0  pointer-events-none z-30" />
    </div>
  );
};

export default AlbumPage;
