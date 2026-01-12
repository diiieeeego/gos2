import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        username: `Player_${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`,
        pointsDaily: 0,
        pointsWeekly: 0,
        pointsTotal: 0,
        loginStreak: 1,
        lastLoginAt: new Date(),
        packs: [],
        ownedCards: [],
      });
      
      console.log(`New user created: ${walletAddress}`);
    } else {
      user.lastLoginAt = new Date();
      await user.save();
      console.log(`Existing user logged in: ${walletAddress}`);
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });

  } catch (error: unknown) {
    // ISPRAVLJENO: Provjera tipa greške umjesto 'any'
    const errorMessage = error instanceof Error ? error.message : "Unknown database error";
    
    console.error("Database error:", errorMessage);
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}