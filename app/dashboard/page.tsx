"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Tipovi za podatke
interface Card {
  id: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic';
}

interface UserStats {
  username: string;
  email: string;
  avatarUrl: string;
  totalPoints: number;
  weeklyPoints: number;
  gamesPlayed: number;
  cardCollectionCount: number;
  recentCards: Card[];
}

const Dashboard = () => {
  // Stanje za odabranu karticu (Lightbox)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const user: UserStats = {
    username: "RETRO_PLAYER_99",
    email: "player@nintendo.com",
    avatarUrl: "/avatar.webp",
    totalPoints: 12550,
    weeklyPoints: 450,
    gamesPlayed: 84,
    cardCollectionCount: 12,
    recentCards: [
      { id: 1, name: "Ancient Ent", rarity: 'epic' },
      { id: 2, name: "Wolf", rarity: 'common' },
      { id: 3, name: "Void Eye", rarity: 'rare' },
      { id: 4, name: "Ghost", rarity: 'common' },
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 font-mono uppercase relative">
      
      {/* --- LIGHTBOX OVERLAY --- */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-md bg-black/80 animate-in fade-in duration-300"
          onClick={() => setSelectedCard(null)}
        >
          <div className="relative animate-in zoom-in-95 duration-300 w-[85vw] max-w-87.5">
             <DashboardCard card={selectedCard} isExpanded />
             <p className="text-center mt-6 text-[10px] text-white animate-pulse tracking-widest">
                [ Click anywhere to close ]
             </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className={`max-w-4xl mx-auto border-4 border-primary-purple p-6 bg-black shadow-[8px_8px_0px_0px_rgba(145,63,141,1)] transition-all duration-500 ${selectedCard ? 'blur-md scale-95' : ''}`}>
        
        {/* Header - Profile Info */}
        <header className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b-4 border-primary-purple pb-8">
          <div className="w-24 h-24 bg-primary-purple p-1 ring-4 ">
            <Image 
              src={user.avatarUrl} 
              alt="Avatar" 
              width={100}
              height={100}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-purple mb-2 tracking-tighter">
              {user.username}
            </h1>
            <p className="text-xs text-zinc-500 mb-4">{user.email}</p>
            <div className="inline-block bg-primary-purple text-white px-4 py-1 text-sm animate-pulse">
              LVL 15 ARCHMAGE
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <section className="border-4 border-zinc-800 p-4 bg-zinc-900/50">
            <h2 className="text-primary-purple mb-4 text-lg underline">Statistics</h2>
            <div className="space-y-4">
              <StatRow label="Total Points" value={user.totalPoints.toLocaleString()} color="text-yellow-400" />
              <StatRow label="Weekly" value={user.weeklyPoints} color="text-green-400" />
              <StatRow label="Games" value={user.gamesPlayed} />
            </div>
          </section>

          <section className="border-4 border-zinc-800 p-4 bg-zinc-900/50 flex flex-col justify-between">
            <div>
              <h2 className="text-primary-purple mb-4 text-lg underline">Inventory</h2>
              <div className="flex items-center justify-between">
                <span>Cards:</span>
                <span className="text-xl text-primary-purple">{user.cardCollectionCount}/150</span>
              </div>
            </div>
            <div className="w-full h-6 bg-zinc-800 mt-4 border-2 border-zinc-700">
              <div 
                className="h-full bg-primary-purple shadow-[inset_-4px_0px_0px_rgba(0,0,0,0.3)]" 
                style={{ width: `${(user.cardCollectionCount / 150) * 100}%` }}
              ></div>
            </div>
          </section>
        </div>

        {/* YOUR COLLECTION GRID */}
        <section className="mt-12 border-t-4 border-zinc-800 pt-8">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest">
              Your Collection
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {user.recentCards.map((card) => (
              <div 
                key={card.id} 
                className="group cursor-pointer"
                onClick={() => setSelectedCard(card)}
              >
                <DashboardCard card={card} />
              </div>
            ))}
            <div className="border-2 border-dashed border-zinc-800 aspect-3/4 flex items-center justify-center text-zinc-800 text-[10px]">
              Empty Slot
            </div>
          </div>
        </section>

        {/* Action Buttons na dnu */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-zinc-900 pt-6">
          <Link href="/albumpage"><RetroButton>Open Your Album</RetroButton></Link>
          <Link href="/marketplace"><RetroButton variant="secondary">Go to Marketplace</RetroButton></Link>
        </div>
      </div>
    </div>
  );
};

/* --- POMOĆNA KOMPONENTA ZA KARTICU --- */
const DashboardCard = ({ card, isExpanded = false }: { card: Card, isExpanded?: boolean }) => {
  const rarityColors = {
    common: "border-zinc-700",
    rare: "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    epic: "border-yellow-500 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.4)]"
  };

  return (
    <div className={`
      relative aspect-3/4 border-4 ${rarityColors[card.rarity]} bg-zinc-900 overflow-hidden 
      ${isExpanded ? 'border-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-1'}
    `}>
      <Image 
        src="/gosCard.png"
        alt="Card Bg"
        fill
        className="object-cover opacity-80"
        style={{ imageRendering: 'pixelated' }}
      />
      
      <div className={`absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-10 ${isExpanded ? 'from-black/90' : ''}`} />
      
      <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
        <p className={`text-white font-bold leading-tight uppercase tracking-tighter ${isExpanded ? 'text-xl' : 'text-[9px] md:text-[10px] truncate'}`}>
          {card.name}
        </p>
        {isExpanded && (
          <p className="text-[10px] text-zinc-400 mt-1">Rarity: {card.rarity}</p>
        )}
      </div>

      {/* Retro Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-white/10 z-20 pointer-events-none"></div>
    </div>
  );
};

const StatRow = ({ label, value, color = "text-white" }: { label: string, value: string | number, color?: string }) => (
  <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-1 text-sm">
    <span className="text-zinc-400">{label}:</span>
    <span className={`${color} font-bold`}>{value}</span>
  </div>
);

const RetroButton = ({ children, variant = "primary" }: { children: React.ReactNode, variant?: "primary" | "secondary" }) => {
  const styles = variant === "primary" 
    ? "bg-primary-purple/80 hover:bg-primary-purple text-white" 
    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300";
    
  return (
    <button className={`${styles} w-full py-4 px-6 transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-white/10 text-[10px] font-bold cursor-pointer uppercase tracking-widest`}>
      {children}
    </button>
  );
};

export default Dashboard;