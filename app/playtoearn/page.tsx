"use client";

import React, { useState } from "react";

const PlayToEarn = () => {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("Roll the dice to win points!");
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);

  const rollDice = async () => {
    if (isRolling) return;

    setIsRolling(true);
    setMessage("Rolling...");
    setLastWin(null);

    try {
      // 1. Pozivamo backend s wallet adresom
      // NAPOMENA: Ovdje koristi stvarnu adresu iz svog auth sustava
      const response = await fetch("/api/roll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: "0x1234567890abcdef" }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error || "Server error");

      // 2. Vizualna animacija (random brojevi dok čekamo "finalizaciju")
      let counter = 0;
      const interval = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
        counter++;

        if (counter > 15) {
          // Malo duža animacija za bolji osjećaj
          clearInterval(interval);

          // 3. Postavljamo finalne rezultate dobivene sa servera
          setDiceValue(data.diceValue);
          setIsRolling(false);
          setLastWin(data.pointsWon);
          setTotalPoints(data.newTotal);

          // Finalizacija poruke
          finalizeGame(data.rarity, data.pointsWon);
        }
      }, 80);
    } catch (err) {
      // Provjeravamo je li err instanca Error objekta
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

  return (
    <div className="min-h-screen bg-background text-foreground p-4 font-mono uppercase">
      <div className="max-w-2xl mx-auto border-4 border-primary-purple p-6 bg-black shadow-[8px_8px_0px_0px_rgba(145,63,141,1)]">
        {/* Header */}
        <div className="text-center mb-10 border-b-4 border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold text-primary-purple mb-2 tracking-tighter">
            Play To Earn
          </h1>
          {totalPoints !== null && (
            <p className="text-yellow-400 text-xs">
              Balance: {totalPoints} PTS
            </p>
          )}
        </div>

        {/* Game Area */}
        <div className="flex flex-col items-center py-10 bg-zinc-900/30 border-2 border-dashed border-zinc-700 mb-8">
          {/* The Dice */}
          <div
            className={`
            w-24 h-24 bg-white border-4 border-zinc-400 flex items-center justify-center mb-8
            shadow-[6px_6px_0px_0px_rgba(145,63,141,1)]
            ${isRolling ? "animate-bounce" : ""}
          `}
          >
            {diceValue ? (
              <div className="grid grid-cols-3 gap-2 p-2 w-full h-full">
                <DiceDots value={diceValue} />
              </div>
            ) : (
              <span className="text-black text-4xl">?</span>
            )}
          </div>

          {/* Status Message */}
          <div className="h-12 text-center mb-6 px-4">
            <p
              className={`text-sm ${
                lastWin ? "text-yellow-400 animate-pulse" : "text-white"
              }`}
            >
              {message}
            </p>
          </div>

          {/* Roll Button */}
          <button
            onClick={rollDice}
            disabled={isRolling}
            className={`
              relative px-8 py-4 text-lg font-bold transition-all
              ${
                isRolling
                  ? "bg-zinc-600 cursor-not-allowed"
                  : "bg-primary-purple hover:bg-primary-purple/80 cursor-pointer active:translate-y-1 active:shadow-none"
              }
              text-white border-2 border-white/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            `}
          >
            {isRolling ? "WAITING..." : "ROLL DICE"}
          </button>
        </div>

        {/* Rewards Info Table */}
        <div className="border-4 border-zinc-800 p-4 bg-zinc-900/50">
          <h2 className="text-primary-purple mb-4 text-xs underline text-center">
            Rarity Rewards
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span>Common:</span>
              <span className="text-white">10 PTS</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span>Rare:</span>
              <span className="text-blue-400">30 PTS</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span>Epic:</span>
              <span className="text-purple-400">100 PTS</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span>Legendary:</span>
              <span className="text-yellow-400">500 PTS</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="text-[10px] text-zinc-500 hover:text-primary-purple underline"
          >
            &lt; Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

// Pomoćna komponenta za točkice na kockici
const DiceDots = ({ value }: { value: number }) => {
  const dotPositions = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  const activeDots = dotPositions[value as keyof typeof dotPositions] || [];

  return (
    <>
      {[...Array(9)].map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {activeDots.includes(i) && (
            <div className="w-3 h-3 bg-black shadow-[1px_1px_0px_rgba(0,0,0,0.2)]"></div>
          )}
        </div>
      ))}
    </>
  );
};

export default PlayToEarn;
