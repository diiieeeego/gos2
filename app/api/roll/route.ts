import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { rollRarity } from "@/lib/rarityRoll";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 1. Dobivanje walletAddress (u pravom app-u ovo ide preko Session-a/Auth-a)
    // Za testiranje možeš poslati wallet u body-u ili hardkodirati:
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "No wallet address provided" }, { status: 400 });
    }

    // 2. Definiranje šansi i izračun nagrade
    const odds = { common: 0.65, rare: 0.25, epic: 0.08, legendary: 0.02 };
    const rarityResult = rollRarity(odds);

    // Bodovna shema
    const rewards = { common: 10, rare: 30, epic: 100, legendary: 500 };
    const pointsWon = rewards[rarityResult];

    // 3. Ažuriranje korisnika (Povećavamo Daily, Weekly i Total istovremeno)
    const updatedUser = await User.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      { 
        $inc: { 
          pointsDaily: pointsWon,
          pointsWeekly: pointsWon,
          pointsTotal: pointsWon 
        } 
      },
      { new: true } // Vrati nam ažuriranog korisnika
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      rarity: rarityResult,
      pointsWon: pointsWon,
      newTotal: updatedUser.pointsTotal,
      diceValue: Math.floor(Math.random() * 6) + 1
    });

  } catch (error) {
    console.error("Roll Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}