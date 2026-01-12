// lib/createUser.ts
import User from "@/models/User";

export async function findOrCreateUser(walletAddress: string) {
  let user = await User.findOne({ walletAddress });

  if (!user) {
    user = await User.create({
      walletAddress,
      username: `user-${walletAddress.slice(2, 8)}`,
    });
  }

  return user;
}
