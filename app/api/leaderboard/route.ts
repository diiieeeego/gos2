import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

// Definiramo tip povratnih podataka za bolji IntelliSense na frontendu
type LeaderboardUser = Pick<IUser, "username" | "pointsWeekly" | "pointsTotal"> & { _id: string };

export async function GET() {
  try {
    await dbConnect();

    // Izvršavamo query
    const leaderboard: LeaderboardUser[] = await User.find({})
      .select("username pointsWeekly pointsTotal")
      .sort({ pointsTotal: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error: unknown) {
    // Provjeravamo je li error instanca Error klase za sigurnije logiranje
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    console.error("Leaderboard error:", errorMessage);

    return NextResponse.json(
      { error: "Failed to fetch leaderboard", details: errorMessage },
      { status: 500 }
    );
  }
}