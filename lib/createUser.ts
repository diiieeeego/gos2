// lib/createUser.ts
import User from "@/models/User";

export async function findOrCreateUser(walletAddress: string) {
  let user = await User.findOne({ walletAddress });
  const shortWallet = `${walletAddress.slice(0, 4)}${walletAddress.slice(-2)}`;
  const generatedUsername = `gos_${shortWallet}`;

  if (!user) {
    user = await User.create({
      walletAddress,
      username: generatedUsername,
    });
  }

  return user;
}
