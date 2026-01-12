"use client";

import React, { useState, useMemo } from "react";
import { Search, ShoppingCart } from "lucide-react";
import Image from "next/image";

// Definiramo tipove za naše kartice
type Rarity = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

interface NFTCard {
  id: number;
  title: string;
  price: string;
  rarity: Rarity;
  image: string;
}

const ITEMS: NFTCard[] = [
  {
    id: 1,
    title: "Sol Dragon #01",
    price: "2.5 SOL",
    rarity: "GOLD",
    image: "/gosCard.png",
  },
  {
    id: 2,
    title: "Pixel Knight",
    price: "0.8 SOL",
    rarity: "BRONZE",
    image: "/gosCard.png",
  },
  {
    id: 3,
    title: "Neon Phoenix",
    price: "15.0 SOL",
    rarity: "PLATINUM",
    image: "/gosCard.png",
  },
  {
    id: 4,
    title: "Glitch Mage",
    price: "1.2 SOL",
    rarity: "SILVER",
    image: "/gosCard.png",
  },
  {
    id: 5,
    title: "Solana Warrior",
    price: "3.5 SOL",
    rarity: "GOLD",
    image: "/gosCard.png",
  },
  {
    id: 6,
    title: "Cyber Golem",
    price: "0.5 SOL",
    rarity: "BRONZE",
    image: "/gosCard.png",
  },
];

export default function Marketplace() {
  const primaryPurple = "#913f8d";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<Rarity | "ALL">("ALL");

  // Logika filtriranja
  const filteredItems = useMemo(() => {
    return ITEMS.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "ALL" || item.rarity === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-mono selection:bg-[#913f8d] p-4 md:p-8">
      {/* RETRO NASLOV */}
      <header className="max-w-6xl mx-auto text-center mb-16 pt-10">
        <h1
          className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4"
          style={{ color: primaryPurple, textShadow: "4px 4px 0px #000" }}
        >
          GOS <span className="text-white">MARKET</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-500 uppercase tracking-[0.3em] max-w-2xl mx-auto border-y-2 border-dashed border-[#1a1a20] py-4">
          Trade your legendary memories in the 8-bit digital realm.
        </p>
      </header>

      {/* FILTERI I SEARCH */}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="bg-[#121217] border-4 border-black p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-[8px_8px_0px_#1a1a20]">
          {/* Search Box */}
          <div className="relative w-full md:w-1/3 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#913f8d]"
              size={18}
            />
            <input
              type="text"
              placeholder="SEARCH ITEMS..."
              className="w-full bg-[#0a0a0c] border-2 border-[#1a1a20] p-3 pl-10 text-xs focus:border-[#913f8d] outline-none uppercase transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Rarity Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {(["ALL", "BRONZE", "SILVER", "GOLD", "PLATINUM"] as const).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)} // Više ne treba 'as any'
                  className={`px-3 py-1 text-[10px] font-black border-2 transition-all ${
                    activeFilter === f
                      ? "bg-[#913f8d] border-black translate-y-1"
                      : "bg-transparent border-[#1a1a20] hover:border-[#913f8d]"
                  }`}
                >
                  {f}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* GRID KARTICA */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <MarketCard
              key={item.id}
              item={item}
              primaryPurple={primaryPurple}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 border-4 border-dashed border-[#1a1a20]">
            <p className="text-gray-500 uppercase italic">
              No items found in this timeline...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// POMOĆNA KOMPONENTA ZA KARTICU
function MarketCard({
  item,
  primaryPurple,
}: {
  item: NFTCard;
  primaryPurple: string;
}) {
  const rarityColors = {
    BRONZE: "#cd7f32",
    SILVER: "#c0c0c0",
    GOLD: "#ffd700",
    PLATINUM: "#e5e4e2",
  };

  return (
    <div className="bg-[#121217] border-4 border-black p-4 group hover:border-[#913f8d] transition-all relative overflow-hidden flex flex-col shadow-[6px_6px_0px_#000]">
      {/* Rarity Tag */}
      <div
        className="absolute top-2 right-2 px-2 py-0.5 text-[8px] font-black border-2 border-black z-10"
        style={{ backgroundColor: rarityColors[item.rarity], color: "#000" }}
      >
        {item.rarity}
      </div>

      {/* Image Container */}
      <div className="bg-[#0a0a0c] border-2 border-black aspect-square mb-4 relative overflow-hidden flex items-center justify-center">
        <Image
          src={item.image}
          alt={item.title}
          width={200}
          height={200}
          className="object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
        />
        {/* Retro scanlines effect overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]"></div>
      </div>

      {/* Info */}
      <h3 className="text-lg font-black uppercase italic mb-1 tracking-tighter">
        {item.title}
      </h3>
      <div className="flex justify-between items-end mt-auto pt-4 border-t-2 border-dashed border-[#1a1a20]">
        <div>
          <span className="text-[10px] text-gray-500 block uppercase">
            Price
          </span>
          <span className="font-bold text-[#913f8d]">{item.price}</span>
        </div>
        <button className="bg-white text-black p-2 hover:bg-[#913f8d] hover:text-white transition-colors border-b-4 border-gray-400 active:border-b-0 active:translate-y-1">
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
}
