"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

// 1. Ažurirani Interface da odgovara tvom MongoDB modelu
interface Card {
  _id: string; // Mongo koristi _id
  name: string;
  rarity: "common" | "rare" | "epic";
}

interface UserStats {
  username: string;
  walletAddress: string;
  avatarUrl: string;
  
  // Bodovi
  pointsTotal: number;
  pointsWeekly: number;
  
  // Progresija i status (Dodano za Header)
  level: number;
  xp: number;             // Potrebno za XP progress bar
  role: "player" | "admin"; // Potrebno za Role Tag
  loginStreak: number;
  
  // Ekonomija
  currency: number;       // Potrebno za Currency StatRow
  
  // Kolekcija
  ownedCards: Card[];
  cardCollectionCount?: number; // Opcionalno, ako šalješ samo broj s backenda
}

const Dashboard = () => {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (publicKey) {
        try {
          const res = await fetch(
            `/api/user?publicKey=${publicKey.toBase58()}`
          );
          const data = await res.json();
          if (res.ok) {
            setUser(data);
          }
        } catch (err) {
          console.error("Greška pri dohvatu korisnika:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (connected) fetchUserData();
    else setLoading(false);
  }, [publicKey, connected]);

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black font-mono p-4">
        <div className="border-4 border-red-500 p-8 text-red-500 animate-pulse text-center">
          [ ACCESS DENIED: PLEASE CONNECT WALLET ]
        </div>
      </div>
    );
  }

  // Provjera Loadinga ILI ako user još nije definiran (da izbjegnemo toLocaleString error)
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono uppercase tracking-widest">
        Loading User Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 font-mono uppercase relative pb-16">
      {/* --- LIGHTBOX --- */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-md bg-black/80"
          onClick={() => setSelectedCard(null)}
        >
          <div className="relative w-[85vw] max-w-xs">
            <DashboardCard card={selectedCard} isExpanded />
            <p className="text-center mt-6 text-[10px] text-white">
              [ Click to close ]
            </p>
          </div>
        </div>
      )}

      <div
        className={`max-w-4xl mx-auto border-4 border-primary-purple p-6 bg-black shadow-[8px_8px_0px_0px_rgba(145,63,141,1)] ${
          selectedCard ? "blur-md" : ""
        }`}
      >
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b-4 border-primary-purple pb-8">
          {/* AVATAR SEKCIJA */}
          <div className="relative">
            <div className="w-24 h-24 bg-primary-purple p-1 shadow-[4px_4px_0px_0px_rgba(145,63,141,0.5)]">
              <Image
                src={user.avatarUrl || "/avatar.webp"}
                alt="Avatar"
                width={100}
                height={100}
                className="w-full h-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            {/* Status indikator (Online) */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black animate-pulse"></div>
          </div>

          {/* INFO SEKCIJA */}
          <div className="text-center md:text-left flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-purple tracking-tighter truncate">
                {user.username}
              </h1>

              {/* ROLE TAG */}
              <span
                className={`text-[10px] px-2 py-0.5 border-2 self-center font-black ${
                  user.role === "admin"
                    ? "border-red-500 text-red-500 bg-red-500/10"
                    : "border-primary-purple text-primary-purple bg-primary-purple/10"
                }`}
              >
                {user.role?.toUpperCase() || "PLAYER"}
              </span>
            </div>

            {/* WALLET ADDRESS */}
            <p className="text-[10px] text-zinc-500 mb-4 truncate max-w-xs font-mono opacity-70">
              ID: {user.walletAddress}
            </p>

            {/* LVL & XP DESIGN */}
            <div className="flex flex-col gap-2 max-w-50 mx-auto md:mx-0">
              <div className="flex justify-between items-end">
                <div className="inline-block bg-primary-purple text-white px-4 py-1 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]">
                  LVL {user.level || 1}{" "}
                  {user.role === "admin" ? "ARCHMAGE" : "NOVICE"}
                </div>
                <span className="text-[10px] text-zinc-400">
                  XP: {user.xp || 0}/1000
                </span>
              </div>

              {/* XP PROGRESS BAR */}
              <div className="w-full h-2 bg-zinc-800 border border-zinc-700 relative overflow-hidden">
                <div
                  className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-1000"
                  style={{
                    width: `${Math.min(((user.xp || 0) % 1000) / 10, 100)}%`,
                  }}
                ></div>
                {/* Retro scanline efekt na baru */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_50%,transparent_50%)] bg-size[100%_2px] pointer-events-none"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <section className="border-4 border-zinc-800 p-4 bg-zinc-900/50">
            <h2 className="text-primary-purple mb-4 text-lg underline">
              Statistics
            </h2>
            <div className="space-y-4">
              {/* Korištenje ispravnih naziva polja iz baze uz fallback na 0 */}
              <StatRow
                label="Total Points"
                value={(user.pointsTotal || 0).toLocaleString()}
                color="text-yellow-400"
              />
              <StatRow
                label="Weekly"
                value={user.pointsWeekly || 0}
                color="text-green-400"
              />
              <StatRow label="Streak" value={`${user.loginStreak || 0} Days`} />
            </div>
          </section>

          <section className="border-4 border-zinc-800 p-4 bg-zinc-900/50 flex flex-col justify-between">
            <div>
              <h2 className="text-primary-purple mb-4 text-lg underline">
                Inventory
              </h2>
              <div className="flex items-center justify-between">
                <span>Cards:</span>
                <span className="text-xl text-primary-purple">
                  {user.ownedCards?.length || 0}/150
                </span>
              </div>
            </div>
            <div className="w-full h-6 bg-zinc-800 mt-4">
              <div
                className="h-full bg-primary-purple"
                style={{
                  width: `${Math.min(
                    ((user.ownedCards?.length || 0) / 150) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </section>
        </div>

        {/* Collection */}
        <section className="mt-12 border-t-4 border-zinc-800 pt-8">
          <h2 className="text-xl font-bold text-white mb-6">Your Collection</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {user.ownedCards &&
              user.ownedCards.slice(0, 4).map((card) => (
                <div key={card._id} onClick={() => setSelectedCard(card)}>
                  <DashboardCard card={card} />
                </div>
              ))}
            {(!user.ownedCards || user.ownedCards.length === 0) && (
              <div className="border-2 border-dashed border-zinc-800 aspect-3/4 flex items-center justify-center text-zinc-500 text-[10px]">
                No cards found
              </div>
            )}
          </div>
        </section>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/albumpage">
            <RetroButton>Open Your Album</RetroButton>
          </Link>
          <Link href="/marketplace">
            <RetroButton variant="secondary">Marketplace</RetroButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ... (Pomoćne komponente DashboardCard, StatRow i RetroButton ostaju iste)

/* --- POMOĆNA KOMPONENTA ZA KARTICU --- */
const DashboardCard = ({
  card,
  isExpanded = false,
}: {
  card: Card;
  isExpanded?: boolean;
}) => {
  const rarityColors = {
    common: "border-zinc-700",
    rare: "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    epic: "border-yellow-500 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.4)]",
  };

  return (
    <div
      className={`
      relative aspect-3/4 border-4 ${
        rarityColors[card.rarity]
      } bg-zinc-900 overflow-hidden 
      ${
        isExpanded
          ? "border-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
          : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-1"
      }
    `}
    >
      <Image
        src="/gosCard.png"
        alt="Card Bg"
        fill
        className="object-cover opacity-80"
        style={{ imageRendering: "pixelated" }}
      />

      <div
        className={`absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-10 ${
          isExpanded ? "from-black/90" : ""
        }`}
      />

      <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
        <p
          className={`text-white font-bold leading-tight uppercase tracking-tighter ${
            isExpanded ? "text-xl" : "text-[9px] md:text-[10px] truncate"
          }`}
        >
          {card.name}
        </p>
        {isExpanded && (
          <p className="text-[10px] text-zinc-400 mt-1">
            Rarity: {card.rarity}
          </p>
        )}
      </div>

      {/* Retro Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-white/10 z-20 pointer-events-none"></div>
    </div>
  );
};

const StatRow = ({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string | number;
  color?: string;
}) => (
  <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-1 text-sm">
    <span className="text-zinc-400">{label}:</span>
    <span className={`${color} font-bold`}>{value}</span>
  </div>
);

const RetroButton = ({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) => {
  const styles =
    variant === "primary"
      ? "bg-primary-purple/80 hover:bg-primary-purple text-white"
      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300";

  return (
    <button
      className={`${styles} w-full py-4 px-6 transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-white/10 text-[10px] font-bold cursor-pointer uppercase tracking-widest`}
    >
      {children}
    </button>
  );
};

export default Dashboard;
