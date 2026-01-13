"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

// Tip podataka koji odgovara tvom API-ju
interface LeaderboardEntry {
  _id: string;
  username: string;
  pointsWeekly: number;
  pointsTotal: number;
}

const PlayToEarn = () => {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("Roll the dice to win points!");
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const { connected, publicKey } = useWallet();

  // State za leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  // Dohvaćanje leaderboard podataka
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeaderboard(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchLeaderboard();
    }
  }, [connected]);

  const rollDice = async () => {
    if (isRolling) return;

    setIsRolling(true);
    setMessage("Rolling...");
    setLastWin(null);

    try {
      const response = await fetch("/api/roll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey?.toBase58() }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Server error");

      let counter = 0;
      const interval = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
        counter++;

        if (counter > 15) {
          clearInterval(interval);
          setDiceValue(data.diceValue);
          setIsRolling(false);
          setLastWin(data.pointsWon);
          setTotalPoints(data.newTotal);
          finalizeGame(data.rarity, data.pointsWon);
          // Osvježi leaderboard nakon dobitka
          fetchLeaderboard();
        }
      }, 80);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("An unexpected error occurred");
      }
      setIsRolling(false);
    }
  };

  const finalizeGame = (rarity: string, points: number) => {
    if (rarity === "legendary") {
      setMessage(`🔥 JACKPOT! +${points} PTS (${rarity.toUpperCase()})`);
    } else if (rarity === "epic") {
      setMessage(`⭐ EPIC ROLL! +${points} PTS`);
    } else {
      setMessage(`+${points} POINTS GAINED! (${rarity})`);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black font-mono p-4">
        <div className="border-4 border-red-500 p-8 text-red-500 animate-pulse text-center">
          [ ACCESS DENIED: PLEASE CONNECT WALLET ]
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 font-mono uppercase pb-20">
      <div className="max-w-2xl mx-auto border-4 border-primary-purple p-4 md:p-6 bg-black shadow-[8px_8px_0px_0px_rgba(145,63,141,1)]">
        
        {/* Header */}
        <div className="text-center mb-10 border-b-4 border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold text-primary-purple mb-2 tracking-tighter">
            Play To Earn
          </h1>
          {totalPoints !== null && (
            <p className="text-yellow-400 text-xs">
              Your Balance: {totalPoints} PTS
            </p>
          )}
        </div>

        {/* Game Area */}
        <div className="flex flex-col items-center py-10 bg-zinc-900/30 border-2 border-dashed border-zinc-700 mb-8">
          <div className={`w-24 h-24 bg-white border-4 border-zinc-400 flex items-center justify-center mb-8 shadow-[6px_6px_0px_0px_rgba(145,63,141,1)] ${isRolling ? "animate-bounce" : ""}`}>
            {diceValue ? (
              <div className="grid grid-cols-3 gap-2 p-2 w-full h-full">
                <DiceDots value={diceValue} />
              </div>
            ) : (
              <span className="text-black text-4xl font-bold">?</span>
            )}
          </div>

          <div className="h-12 text-center mb-6 px-4">
            <p className={`text-sm ${lastWin ? "text-yellow-400 animate-pulse" : "text-white"}`}>
              {message}
            </p>
          </div>

          <button
            onClick={rollDice}
            disabled={isRolling}
            className={`relative px-8 py-4 text-lg font-bold transition-all ${isRolling ? "bg-zinc-600 cursor-not-allowed" : "bg-primary-purple hover:bg-primary-purple/80 cursor-pointer active:translate-y-1 active:shadow-none"} text-white border-2 border-white/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
          >
            {isRolling ? "WAITING..." : "ROLL DICE"}
          </button>
        </div>

        {/* Leaderboard Section */}
        <div className="border-4 border-primary-purple p-4 bg-zinc-900/50 mb-8">
          <h2 className="text-primary-purple mb-4 text-sm font-bold text-center italic">
            🏆 TOP PLAYERS 🏆
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] md:text-xs text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-700 text-zinc-500">
                  <th className="pb-2 font-normal">RANK</th>
                  <th className="pb-2 font-normal">PLAYER</th>
                  <th className="pb-2 font-normal text-right">WEEKLY</th>
                  <th className="pb-2 font-normal text-right text-primary-purple">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {loadingLeaderboard ? (
                  <tr><td colSpan={4} className="py-4 text-center animate-pulse">Loading data...</td></tr>
                ) : (
                  leaderboard.map((user, index) => (
                    <tr key={user._id} className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors">
                      <td className="py-2 text-zinc-500">#{index + 1}</td>
                      <td className="py-2 text-white font-bold truncate max-w-25 md:max-w-none">
                        {user.username}
                      </td>
                      <td className="py-2 text-right text-zinc-400">{user.pointsWeekly}</td>
                      <td className="py-2 text-right text-yellow-400 font-bold">{user.pointsTotal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rewards Info Table */}
        <div className="border-4 border-zinc-800 p-4 bg-zinc-900/50">
          <h2 className="text-primary-purple mb-4 text-[10px] underline text-center">
            Rarity Rewards
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
            <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Common:</span><span className="text-white">10 PTS</span></div>
            <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Rare:</span><span className="text-blue-400">30 PTS</span></div>
            <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Epic:</span><span className="text-purple-400">100 PTS</span></div>
            <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Legendary:</span><span className="text-yellow-400">500 PTS</span></div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/dashboard" className="text-[10px] text-zinc-500 hover:text-primary-purple underline">
            &lt; Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

// DiceDots ostaje isti...
const DiceDots = ({ value }: { value: number }) => {
  const dotPositions = {
    1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
  };
  const activeDots = dotPositions[value as keyof typeof dotPositions] || [];
  return (
    <>
      {[...Array(9)].map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {activeDots.includes(i) && <div className="w-2 h-2 md:w-3 md:h-3 bg-black"></div>}
        </div>
      ))}
    </>
  );
};

export default PlayToEarn;