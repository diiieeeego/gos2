import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import "@/models/Card"; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('publicKey');

  if (!wallet) {
    return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ walletAddress: wallet.toLowerCase() })
      .populate("ownedCards");

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    // Umjesto :any, koristimo provjeru instance ili Error tip
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    
    console.error("Database error:", errorMessage);
    
    return NextResponse.json(
      { error: 'Database error', details: errorMessage }, 
      { status: 500 }
    );
  }
}