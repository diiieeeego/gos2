import React from "react";
import {
  Gamepad2,
  Smartphone,
  Dices,
  LayoutGrid,
  Coins,
  ShieldCheck,
  Box,
  Store,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game of Sol | The Legacy of Solana Immortalized",
  description: "Collect, trade, and preserve the history of Solana. Join the ultimate digital album experience with dragons, booster packs, and $GOS tokens.",
  keywords: ["Solana", "NFT", "Digital Album", "GOS Token", "Crypto Collecting", "Blockchain Game"],
  openGraph: {
    title: "Game of Sol | Digital Collectible Album",
    description: "The dragon has awakened. Collect rare cards and complete your Solana legacy album.",
    url: "https://gameofsol.com", // Zamijeni svojom domenom
    siteName: "Game of Sol",
    images: [
      {
        url: "/og-image.png", // Putanja do slike koju će FB/Twitter prikazati
        width: 1200,
        height: 630,
        alt: "Game of Sol Dragon Legacy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game of Sol | Solana Legacy",
    description: "The Dragon has awakened on Solana. Are you ready to collect the legacy?",
    images: ["/og-image.png"], // Ista slika kao za OG
  },
};

export default function Home() {
  const primaryPurple = "#913f8d";

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-mono selection:bg-[#913f8d] ">
      

      {/* HERO SECTION - THE LEGACY */}
      <section className="relative pt-20 pb-32 px-4 border-b-8 border-[#1a1a20]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block p-2 bg-[#913f8d]/10 border-2 border-dashed border-[#913f8d] mb-6 animate-pulse text-xs tracking-widest text-[#913f8d]">
            <div className="flex items-center px-4">
              
              <span>THE DRAGON HAS AWAKENED ON SOLANA</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-8 italic uppercase tracking-tighter leading-none">
            The Legacy of Solana,{" "}
            <span style={{ color: primaryPurple }}>Immortalized</span>
          </h2>
          <div className="bg-[#913f8d]/10 border-2 border-[#913f8d] p-6 mb-10 text-left relative">
            <div className="absolute -top-3 -left-3 bg-[#913f8d] text-white px-2 py-1 text-[10px] font-bold">
              STORY_LOG.EXE
            </div>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed uppercase tracking-tight">
              We believe in the power of memories. The Solana community has
              endured highs, lows, and everything in between. Game of Sol is a
              celebration of this journey—preserving the milestones, challenges,
              and triumphs that define our ecosystem.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="h-1 w-20 bg-primary-purple/70 rounded-full block"></div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-[0.2em]">
              It&apos;s all about collecting cards, participating in challenges, and completing your album!
            </p>
            
          </div>
          
          
        </div>
        {/* Retro Grid Background Effect */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `linear-gradient(${primaryPurple} 1px, transparent 1px), linear-gradient(90deg, ${primaryPurple} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </section>

      {/* THE GUARDIANS SECTION */}
      <section className="py-24 px-4 bg-[#111118]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-square border-8 border-[#1a1a24] bg-[#0a0a0c] flex items-center justify-center p-12 group transition-all hover:border-[#913f8d]">
              <div className="text-8xl md:text-[12rem] animate-bounce filter drop-shadow-[0_0_20px_#913f8d]">
                <Image
                  alt="Album Icon"
                  src="/album.png"
                  width={150}
                  height={150}
                />
              </div>
              {/* 8-bit corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#913f8d]"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#913f8d]"></div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-3xl font-black uppercase italic mb-6 border-l-8 border-[#913f8d] pl-6">
              Guardians of the Album
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6 uppercase text-sm tracking-wide">
              At the heart of our story stand mystical dragons, the protectors
              of the Game of Sol album. These legendary creatures ensure that
              the memories of Solana are safeguarded.
            </p>
            <p className="text-[#913f8d] font-bold text-lg uppercase italic">
              Every collector helps preserve the legacy. Help us ensure history
              is never forgotten.
            </p>
          </div>
        </div>
      </section>

      {/* ROADMAP / ECOSYSTEM GRID */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-black uppercase italic tracking-widest mb-4">
              Ecosystem Modules
            </h3>
            <div className="h-2 w-32 bg-[#913f8d] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: The Album */}
            <ModuleCard
              icon={<LayoutGrid style={{ color: primaryPurple }} />}
              href="#"
              title="Digital Album"
              desc="A dynamic collectible hub where users store and showcase cards representing key moments and projects."
            />

            {/* Card 2: Booster Packs */}
            <ModuleCard
              icon={<Box style={{ color: primaryPurple }} />}
              href="#"
              title="Booster Packs"
              desc="The core feature. Open current-season packs to trade, complete collections, and earn rewards."
            />

            {/* Card 3: GOS Token */}
            <ModuleCard
              icon={<Coins style={{ color: primaryPurple }} />}
              href="#"
              title="$GOS Token"
              desc="The official currency of Game of Sol. Enhancing trading, rewards, and in-game utility."
            />

            {/* Card 4: Mobile App */}
            <ModuleCard
              icon={<Smartphone style={{ color: primaryPurple }} />}
              href="#mobileApp"
              title="Mobile App"
              desc="A seamless, handheld experience for trading and collecting on the go."
            />

            {/* Card 5: Mobile Game */}
            <ModuleCard
              icon={<Gamepad2 style={{ color: primaryPurple }} />}
              href="#mobileApp"
              title="Play-to-Earn"
              desc="Engage in our mobile game to earn $GOS tokens while expanding your collection."
            />

            {/* Card 7: Giving Back */}
            <ModuleCard
              icon={<ShieldCheck style={{ color: primaryPurple }} />}
              href="#"
              title="Giving Back"
              desc="Allocated funds for community events, airdrops, and exclusive opportunities for loyal supporters."
            />

            {/* Card 8: Marketplace */}
            <ModuleCard
              icon={<Store style={{ color: primaryPurple }} />}
              href="#marketplace"
              title="Marketplace"
              desc="A decentralized marketplace for trading and selling your digital collectibles."
            />
          </div>
        </div>
      </section>

      {/* EARN REWARDS BANNER */}
      <section className="max-w-6xl mx-auto px-4 my-12">
        <div className="bg-[#121217] border-4 border-dashed border-[#913f8d] p-10 text-center">
          <Dices
            size={48}
            className="mx-auto mb-6"
            style={{ color: primaryPurple }}
          />
          <h4 className="text-2xl font-black uppercase mb-4 tracking-tighter">
            Your reward is the sum of two dices you rolled
          </h4>
          <p className="text-gray-400 uppercase text-xs tracking-[0.3em] mb-8">
            Come back every day and be first on our leaderboard for crazy
            awards!
          </p>
          <div className="flex justify-center gap-4">
            <div className="w-35 h-12.5 flex items-center justify-center bg-white text-black font-black uppercase text-sm border-b-4 border-gray-400">
              Roll Dice
            </div>
            <div className="w-35 h-12.5 flex items-center justify-center bg-[#913f8d] text-white font-black uppercase text-sm border-b-4 border-black">
              Leaderboard
            </div>
          </div>
        </div>
      </section>
      {/* Mobile App Banner */}
      <section id="mobileApp" className="max-w-6xl mx-auto px-4 pb-24">
        <div className="p-1" style={{ backgroundColor: primaryPurple }}>
          <div className="bg-[#0a0a0c] p-8 border-2 border-black flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="relative">
                <Smartphone className="w-16 h-16 text-white animate-pulse" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase italic leading-tight">
                  Mobile Version
                </h3>
                <p className="text-gray-400 uppercase text-xs tracking-[0.2em]">
                  Portable Stickers Coming Q2 2026
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 mb-2 uppercase tracking-tighter font-bold italic">
                Handheld Experience
              </span>
              <div className="px-6 py-2 border-2 border-dashed border-[#913f8d] text-[#913f8d] font-black uppercase text-sm">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}

// Helper Component for the Ecosystem Cards
function ModuleCard({
  icon,
  title,
  href,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  desc: string;
}) {
  return (
    <div className="bg-[#121217] border-t-4 border-l-4 border-r-8 border-b-8 border-black p-8 hover:border-[#913f8d] transition-all group">
      <div className="mb-6 w-fit transform group-hover:scale-130 transition-transform origin-left">
      {icon}
      </div>
      <h4 className="text-xl font-black uppercase italic mb-3 tracking-tighter">
        {title}
      </h4>
      <p className="text-gray-500 text-xs leading-relaxed uppercase font-bold">
        {desc}
      </p>
      
      <Link className="mt-4 w-24 h-8 flex items-center justify-center bg-[#913f8d] text-white font-black uppercase text-sm border-b-4 border-black" href={href}>Go</Link>
    </div>
  );
}
