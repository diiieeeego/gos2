import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const lowerAddress = walletAddress.toLowerCase();
    let user = await User.findOne({ walletAddress: lowerAddress });

    const now = new Date();
    const XP_PER_LOGIN = 100;
    const XP_THRESHOLD = 1000;

    if (!user) {
      const shortWallet = `${walletAddress.slice(0, 4)}${walletAddress.slice(-2)}`;
      const generatedUsername = `gos_${shortWallet}`;
      // PRVI LOGIN IKADA
      user = await User.create({
        walletAddress: lowerAddress,
        username: generatedUsername,
        /* username: `Player_${lowerAddress.slice(0, 4)}...${lowerAddress.slice(-4)}`, */
        xp: XP_PER_LOGIN, // Odmah dajemo prvi bonus
        level: 1,
        lastLoginAt: now,
        // ... ostala polja su defaultna u modelu
      });
      console.log(`New user created with bonus: ${lowerAddress}`);
    } else {
      // POSTOJEĆI KORISNIK - Provjera datuma
      const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : null;
      
      // Provjeravamo je li danas novi dan u odnosu na zadnji login
      const isNewDay = !lastLogin || 
        now.getUTCDate() !== lastLogin.getUTCDate() || 
        now.getUTCMonth() !== lastLogin.getUTCMonth() || 
        now.getUTCFullYear() !== lastLogin.getUTCFullYear();

      if (isNewDay) {
        // 1. Dodaj XP
        user.xp += XP_PER_LOGIN;
        
        // 2. Provjeri Level Up (ako pređe 1000 XP)
        if (user.xp >= XP_THRESHOLD) {
          user.level += 1;
          user.xp = 0; // Resetiranje XP bodova prema tvom zahtjevu
          console.log(`User leveled up to: ${user.username} -> ${user.level}`);
        }
        
        // 3. Ažuriraj streak (opcionalno, ali korisno)
        user.loginStreak = (user.loginStreak || 0) + 1;
      }

      user.lastLoginAt = now;
      await user.save();
      console.log(`Existing user logged in. New day: ${isNewDay}`);
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}