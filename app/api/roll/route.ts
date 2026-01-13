import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { rollRarity } from "@/lib/rarityRoll";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return NextResponse.json({ error: "No wallet address provided" }, { status: 400 });
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- LOGIKA ZA 24h COOLDOWN ---
    const now = new Date();
    const lastRoll = user.lastRoll ? new Date(user.lastRoll) : new Date(0);
    const cooldownMs = 24 * 60 * 60 * 1000; // 24 sata u ms
    const timePassed = now.getTime() - lastRoll.getTime();

    if (timePassed < cooldownMs) {
      const remainingMs = cooldownMs - timePassed;
      return NextResponse.json({ 
        success: false, 
        error: "COOLDOWN_ACTIVE", 
        remaining: remainingMs 
      }, { status: 403 });
    }

    // --- LOGIKA ZA ROLL ---
    const odds = { common: 0.65, rare: 0.25, epic: 0.08, legendary: 0.02 };
    const rarityResult = rollRarity(odds) as keyof typeof rewards;
    const rewards = { common: 10, rare: 30, epic: 100, legendary: 500 };
    const pointsWon = rewards[rarityResult];

    // --- UPDATE KORISNIKA ---
    // Ako je prošlo više od 24h, resetiramo pointsDaily na 0 i onda dodajemo nove bodove
    const updatedUser = await User.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      { 
        $set: { 
            lastRoll: now,
            pointsDaily: pointsWon // Resetira daily i postavlja nove bodove
        },
        $inc: { 
          pointsWeekly: pointsWon,
          pointsTotal: pointsWon 
        } 
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      rarity: rarityResult,
      pointsWon: pointsWon,
      newTotal: updatedUser.pointsTotal,
      diceValue: Math.floor(Math.random() * 6) + 1
    });

  } catch (error) {
    console.error("Roll Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}